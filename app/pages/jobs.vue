<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToast } from '#imports'

const toast = useToast()

// Estado del perfil
const profile = reactive({
  initials: '',
  name: '',
  school: '',
  extra: ''
})

// Jobs + filtros
const jobs = ref<any[]>([])
const filteredJobs = ref<any[]>([])

const filters = reactive({
  search: '',
  location: '',
  type: ''
})

// =============================
// CARGAR PERFIL Y EMPLEOS
// =============================
onMounted(async () => {
  await loadProfile()
  await loadJobs()
})

async function loadProfile() {
  try {
    const res = await $fetch('/api/student/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    profile.name = res.name_student + ' ' + res.last_name_student
    profile.school = res.school
    profile.extra = res.career
    profile.initials = res.name_student.charAt(0) + res.last_name_student.charAt(0)
  } catch (err) {
    console.error(err)
  }
}

async function loadJobs() {
  try {
    const res = await $fetch('/api/jobs')

    // Si tu API devuelve id_offer en lugar de id_job, hacemos un map
    jobs.value = res.map(job => ({
      ...job,
      id_job: job.id_offer  // esto mantiene el v-for como está
    }))
    filteredJobs.value = jobs.value
  } catch (err) {
    toast.add({ title: 'Error cargando empleos', color: 'error' })
  }
}


// =============================
// FILTRO DINÁMICO
// =============================
function applyFilters() {
  filteredJobs.value = jobs.value.filter((job) => {
    const s = filters.search.toLowerCase()
    const matchesSearch
      = job.title.toLowerCase().includes(s)
        || job.company.toLowerCase().includes(s)

    const matchesLocation
      = !filters.location || job.location === filters.location

    const matchesType
      = !filters.type || job.type === filters.type

    return matchesSearch && matchesLocation && matchesType
  })
}
</script>

<template>
  <div class="container mx-auto grid grid-cols-12 gap-6 p-6">
    <aside class="col-span-12 md:col-span-3 space-y-6">
      <UCard class="text-center py-6">
        <div
          class="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-700 to-purple-700 text-white font-bold text-3xl"
        >
          {{ profile.initials }}
        </div>

        <h3 class="text-lg font-semibold mt-3">
          {{ profile.name }}
        </h3>
        <p class="text-gray-400 text-sm">
          {{ profile.extra }}
        </p>
        <p class="text-gray-400 text-xs">
          {{ profile.school }}
        </p>

        <UButton
          class="w-full mt-4"
          to="/profile"
          color="primary"
        >
          Editar perfil
        </UButton>
      </UCard>
    </aside>

    <section class="col-span-12 md:col-span-6 space-y-6">
      <UCard class="p-6">
        <h1 class="text-2xl font-bold">
          Vacantes Disponibles
        </h1>
        <p class="text-gray-500">
          Empleos, prácticas y becas para estudiantes universitarios.
        </p>

        <div class="flex gap-3 mt-4">
          <UInput
            v-model="filters.search"
            placeholder="Buscar: título, empresa…"
            class="flex-1"
          />
          <UButton
            color="primary"
            @click="applyFilters"
          >
            Buscar
          </UButton>
        </div>
      </UCard>

      <div class="space-y-4">
        <UCard
          v-for="job in filteredJobs"
          :key="job.id_job"
          class="p-5 hover:shadow-md transition cursor-pointer"
        >
          <h3 class="text-lg font-semibold">
            {{ job.title }}
          </h3>
          <p class="text-gray-500">
            {{ job.company }}
          </p>

          <div class="flex justify-between mt-2 text-sm">
            <span class="text-primary-600">{{ job.location }}</span>
            <span>{{ job.description }}</span>
          </div>

          <UButton
            color="primary"
            variant="soft"
            class="mt-4"
            :to="`/jobs/${job.id_job}`"
          >
            Ver detalles
          </UButton>
        </UCard>
      </div>
    </section>

    <aside class="col-span-12 md:col-span-3 space-y-6">
      <UCard>
        <h4 class="font-semibold">
          Empresas Destacadas
        </h4>
        <ul class="mt-2 text-sm space-y-1">
          <li>- Dream Team International</li>
          <li>- Trifix</li>
          <li>- Nvidia</li>
        </ul>
      </UCard>

      <UCard>
        <h4 class="font-semibold">
          Consejos rápidos
        </h4>
        <ol class="list-decimal ml-5 space-y-1 text-sm mt-2">
          <li>Completa tu perfil al 100%.</li>
          <li>Adjunta tu CV en PDF.</li>
          <li>Configura tus alertas por correo.</li>
        </ol>
      </UCard>
    </aside>
  </div>
</template>
