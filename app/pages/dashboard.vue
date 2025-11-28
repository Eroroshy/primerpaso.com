<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { navigateTo } from '#app'

const { token, loadUser: loadUserFromAuth, user } = useAuth()

const applications = ref<any[]>([])
const loading = ref(true)

// -------------------------------
// Cargar datos de usuario
// -------------------------------
const loadUser = async () => {
  try {
    const u = await loadUserFromAuth() // Usa el composable actualizado
    if (!u) navigateTo('/login')
  } catch (e) {
    console.error('Error cargando usuario:', e)
    navigateTo('/login')
  }
}

// -------------------------------
// Cargar postulaciones
// -------------------------------
const loadApplications = async () => {
  try {
    const res = await $fetch('/api/applications', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    applications.value = res.data
  } catch (e) {
    console.error('Error cargando postulaciones:', e)
  }
}

// -------------------------------
// Borrar postulación
// -------------------------------
const deleteApplication = async (id: number) => {
  try {
    await $fetch(`/api/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })

    applications.value = applications.value.filter(a => a.id !== id)
  } catch (e) {
    console.error('Error borrando postulación:', e)
  }
}

// -------------------------------
// Inicio
// -------------------------------
onMounted(async () => {
  await loadUser()
  await loadApplications()
  loading.value = false
})
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
    <div
      v-if="loading"
      class="text-center text-gray-500 mt-10"
    >
      Cargando tu información...
    </div>

    <template v-else>
      <StarsBg />
      <div class="bg-neutral shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-primary">
          Mi Perfil
        </h2>

        <p class="mt-2">
          Nombre: {{ user?.name || 'Sin nombre' }}
        </p>

        <p class="">
          Correo: {{ user?.email }}
        </p>

        <UButton
          class="mt-4"
          color="primary"
          icon="i-lucide-pencil"
          @click="navigateTo('/profile')"
        >
          Editar Perfil
        </UButton>

        <UButton
          class="mt-4"
          color="primary"
          icon="i-lucide-briefcase-business"
          @click="navigateTo('/jobs')"
        >
          Vacantes Disponibles
        </UButton>
      </div>

      <div class="bg-neutral shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-primary">
          Mis Postulaciones
        </h2>

        <div
          v-if="applications.length === 0"
          class="text-gray-500 mt-3"
        >
          No tienes postulaciones todavía.
        </div>

        <div
          v-for="a in applications"
          :key="a.id"
          class="p-4 border border-gray-300 rounded-xl mt-4 flex justify-between"
        >
          <div>
            <h3 class="text-lg font-semibold">
              {{ a.title }}
            </h3>
            <p class="text-gray-500">
              {{ a.company }}
            </p>
          </div>

          <div class="flex gap-3">
            <UButton
              color="primary"
              icon="i-lucide-eye"
              @click="navigateTo(`/dashboard/applications/${a.id}`)"
            >
              Ver
            </UButton>

            <UButton
              color="error"
              icon="i-lucide-trash"
              @click="deleteApplication(a.id)"
            >
              Borrar
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
