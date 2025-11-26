<script setup lang="ts">
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="text-2xl font-bold"
      >
        PrimerPaso.com
      </NuxtLink>
    </template>

    <template #right>
      <UButton
        to="login"
        color="secondary"
        label="Inicia Sesión"
        variant="subtle"
        class="hidden lg:block"
      />

      <UButton
        to="register"
        color="primary"
        label="Regístrate"
        variant="subtle"
        class="hidden lg:block"
      />
    </template>

    <template #body>
      <UButton
        color="primary"
        class="mt-4"
        label="Student Portal"
        variant="subtle"
        block
      />
      <UButton
        color="secondary"
        class="mt-4"
        label="Company Portal"
        variant="subtle"
        block
      />
    </template>
  </UHeader>
</template>
