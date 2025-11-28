<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const toast = useToast()
const loading = ref(true)
const saving = ref(false)

// ======================================================
// PROFILE STATE
// ======================================================
const state = reactive({
  name_student: '',
  last_name_student: '',
  telephone_student: '',
  school: '',
  location: '',
  career: ''
})

// ======================================================
// PROFILE SCHEMA
// ======================================================
const schema = z.object({
  name_student: z.string().min(1, 'Ingresa tu nombre'),
  last_name_student: z.string().min(1, 'Ingresa tus apellidos'),
  telephone_student: z.string().min(8, 'Teléfono inválido'),
  school: z.string().min(1, 'Ingresa tu escuela'),
  location: z.string().min(1, 'Ingresa la ubicación'),
  career: z.string().min(1, 'Ingresa tu carrera')
})

// ======================================================
// PASSWORD FORM (UAuthForm)
// ======================================================
const passwordFields: AuthFormField[] = [
  {
    name: 'current',
    label: 'Contraseña actual',
    type: 'password',
    placeholder: 'Ingresa tu contraseña actual',
    required: true
  },
  {
    name: 'newpass',
    label: 'Nueva contraseña',
    type: 'password',
    placeholder: 'Ingresa tu nueva contraseña',
    required: true
  }
]

const passwordSchema = z.object({
  current: z.string().min(1, 'Ingrese su contraseña actual'),
  newpass: z.string().min(8, 'Debe tener al menos 8 caracteres')
})

type PasswordSchema = z.output<typeof passwordSchema>

// ======================================================
// LOAD PROFILE
// ======================================================
onMounted(async () => {
  try {
    const profile = await $fetch('/api/student/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    Object.assign(state, profile)
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar el perfil',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
})

// ======================================================
// SAVE PROFILE
// ======================================================
async function saveProfile(payload: FormSubmitEvent<any>) {
  saving.value = true
  try {
    await $fetch('/api/student/profile/update', {
      method: 'PUT',
      body: payload.data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    toast.add({
      title: 'Perfil actualizado',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      color: 'error',
      title: 'Error al actualizar'
    })
  } finally {
    saving.value = false
  }
}

// ======================================================
// CHANGE PASSWORD
// ======================================================
async function onPasswordSubmit(payload: FormSubmitEvent<PasswordSchema>) {
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      body: payload.data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    toast.add({
      title: 'Contraseña actualizada',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cambiar la contraseña',
      color: 'error'
    })
  }
}

// ======================================================
// DELETE ACCOUNT
// ======================================================
async function deleteAccount() {
  if (!confirm('¿Seguro que deseas eliminar tu cuenta?')) return

  try {
    await $fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    localStorage.removeItem('token')
    navigateTo('/login')
  } catch (err) {
    toast.add({
      color: 'error',
      title: 'Error al eliminar cuenta'
    })
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <StarsBg />
    <div>
      <h1 class="text-3xl font-bold">
        Mi Perfil
      </h1>
      <p class="text-gray-500">
        Actualiza tu información personal y credenciales.
      </p>
    </div>

    <UCard
      v-if="!loading"
      :ui="{ body: 'space-y-6 p-6' }"
    >
      <h2 class="text-xl font-semibold">
        Información Personal
      </h2>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-8"
        @submit="saveProfile"
      >
        <div>
          <h3 class="text-lg font-medium mb-2">
            Datos personales
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormGroup label="Nombre(s)">
              <UInput
                v-model="state.name_student"
                placeholder="Ej: Juan Carlos"
              />
            </UFormGroup>

            <UFormGroup label="Apellidos">
              <UInput
                v-model="state.last_name_student"
                placeholder="Ej: Hernández López"
              />
            </UFormGroup>

            <UFormGroup label="Número telefónico">
              <UInput
                v-model="state.telephone_student"
                placeholder="Ej: 984 123 4567"
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium mb-2">
            Información académica
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormGroup label="Escuela / Universidad">
              <UInput
                v-model="state.school"
                placeholder="Ej: Harvard"
              />
            </UFormGroup>

            <UFormGroup label="Campus / Ubicación">
              <UInput
                v-model="state.location"
                placeholder="Ej: Playa del Carmen"
              />
            </UFormGroup>

            <UFormGroup label="Carrera">
              <UInput
                v-model="state.career"
                placeholder="Ej: Contabilidad"
              />
            </UFormGroup>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <UButton
            color="error"
            variant="soft"
            @click="$router.back()"
          >
            Cancelar
          </UButton>

          <UButton
            type="submit"
            :loading="saving"
          >
            Guardar cambios
          </UButton>
        </div>
      </UForm>
    </UCard>

    <UCard :ui="{ body: 'p-6' }">
      <h2 class="text-xl font-semibold mb-4">
        Cambiar contraseña
      </h2>

      <UAuthForm
        :schema="passwordSchema"
        :fields="passwordFields"
        class="space-y-4"
        :ui="{
          base: 'mt-2',
          footer: 'mt-6',
          body: 'space-y-4',
          card: { base: 'rounded-xl shadow-none border-none' }
        }"
        @submit="onPasswordSubmit"
      />
    </UCard>

    <UCard
      class="border border-red-600"
      :ui="{ body: 'p-6' }"
    >
      <h1 class="text-2xl font-bold text-red-600 mb-4">
        Zona de Peligro
      </h1>

      <h2 class="text-xl font-bold mb-4">
        Eliminar cuenta
      </h2>

      <UButton
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        class="font-bold shadow-md transition"
        @click="deleteAccount"
      >
        Borrar mi cuenta
      </UButton>
    </UCard>
  </div>
</template>
