<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const loading = ref(true)
const saving = ref(false)

const state = reactive({
  first_name: '',
  last_name: '',
  phone: '',
  school: '',
  school_ubication: '',
  career: ''
})

const passwordState = reactive({
  current: '',
  newpass: ''
})

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional(),
  school: z.string().optional(),
  school_ubication: z.string().optional(),
  career: z.string().optional()
})

type Schema = z.output<typeof schema>

// ----------------------------------
// Load Student Profile
// ----------------------------------
onMounted(async () => {
  try {
    const profile = await $fetch('/api/student/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    Object.assign(state, profile)
  } catch (err) {
    console.error(err)
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar el perfil',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
})

// ----------------------------------
// Save Profile
// ----------------------------------
async function saveProfile(payload: FormSubmitEvent<Schema>) {
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
      title: 'Error',
      description: 'No se pudo actualizar',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

// ----------------------------------
// Change Password
// ----------------------------------
async function changePassword() {
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      body: passwordState,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    toast.add({
      title: 'Contraseña actualizada',
      color: 'success'
    })

    passwordState.current = ''
    passwordState.newpass = ''
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cambiar la contraseña',
      color: 'error'
    })
  }
}

// ----------------------------------
// Delete Account
// ----------------------------------
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
      title: 'Error',
      description: 'No se pudo eliminar la cuenta',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">
      Student Profile
    </h1>

    <UCard v-if="!loading">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="saveProfile"
      >
        <UFormGroup label="First name">
          <UInput v-model="state.first_name" />
        </UFormGroup>

        <UFormGroup label="Last name">
          <UInput v-model="state.last_name" />
        </UFormGroup>

        <UFormGroup label="Phone">
          <UInput v-model="state.phone" />
        </UFormGroup>

        <UFormGroup label="School">
          <UInput v-model="state.school" />
        </UFormGroup>

        <UFormGroup label="School school_ubication">
          <UInput v-model="state.school_ubication" />
        </UFormGroup>

        <UFormGroup label="Career">
          <UInput v-model="state.career" />
        </UFormGroup>

        <div class="flex justify-end gap-3 mt-6">
          <UButton
            color="error"
            variant="soft"
            @click="$router.back()"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            :loading="saving"
          >
            Save profile
          </UButton>
        </div>
      </UForm>
    </UCard>

    <UCard class="mt-10">
      <h2 class="text-xl font-semibold mb-4">
        Change password
      </h2>

      <UForm
        class="space-y-4"
        @submit="changePassword"
      >
        <UFormGroup label="Current password">
          <UInput
            v-model="passwordState.current"
            type="password"
          />
        </UFormGroup>

        <UFormGroup label="New password">
          <UInput
            v-model="passwordState.newpass"
            type="password"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="error"
        >
          Update password
        </UButton>
      </UForm>
    </UCard>

    <UCard class="mt-10 border-red-400">
      <h2 class="text-xl font-semibold text-red-600 mb-4">
        Delete account
      </h2>

      <UButton
        color="error"
        @click="deleteAccount"
      >
        Delete my account
      </UButton>
    </UCard>
  </div>
</template>
