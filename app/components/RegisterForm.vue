<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import * as z from 'zod'

const toast = useToast()

// Campos visibles en el formulario
const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo Electrónico',
    placeholder: 'Ingresa tu correo electrónico',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
    required: true
  }
]

// Validación con Zod
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres')
})

type Schema = z.output<typeof schema>

// Submit del formulario
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: payload.data
    })

    toast.add({
      title: 'Registro exitoso',
      description: `Bienvenido ${payload.data.email}`
    })

    console.log('Signup response:', res)

    // Redirige al login (o a donde tú quieras)
    navigateTo('/login')
  } catch (err: any) {
    toast.add({
      color: 'primary',
      title: 'Error',
      description: err?.data?.statusMessage || 'Error desconocido'
    })
  }
}
</script>

<template>
  <div class="w-full">
    <UAuthForm
      :schema="schema"
      :fields="fields"
      class="space-y-4"
      :ui="{
        base: 'mt-2',
        footer: 'mt-6',
        body: 'space-y-4',
        header: 'mb-4 text-center',
        card: {
          base: 'rounded-xl shadow-none border-none'
        }
      }"
      @submit="onSubmit"
    />
  </div>
</template>
