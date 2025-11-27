<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import * as z from 'zod'

const state = reactive({
  email: '',
  password: ''
})

const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'ejemplo@correo.com',
    required: true
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Ingresa tu contraseña',
    required: true
  }
]

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'Debe tener al menos 8 caracteres')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload.data
    })

    toast.add({
      title: 'Inicio de sesión correcto',
      description: `Bienvenido, ${payload.data.email}`,
      color: 'success'
    })

    if (res.token) {
      localStorage.setItem('token', res.token)
    }

    await navigateTo('/dashboard')
  } catch (err: any) {
    toast.add({
      color: 'warning',
      title: 'Error al iniciar sesión',
      description: err?.data?.statusMessage || 'Ha ocurrido un error desconocido'
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
