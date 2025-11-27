<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral p-10">
    <StarsBg />
    <UPageCard
      class="h-xl w-full max-w-md shadow-lg border border-neutral-500 bg-neutral rounded-2xl p-10"
    >
      <div class="text-center mb-6">
        <div class="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
          <UIcon
            name="i-lucide-lock"
            class="w-8 h-8 text-white-600"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Inicia sesión
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <LoginForm />

      <div class="flex items-center my-6">
        <div class="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
        <span class="px-2 text-gray-500 dark:text-gray-400 text-sm">o</span>
        <div class="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      <div class="text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes una cuenta?
        <NuxtLink
          to="/register"
          class="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Regístrate aquí
        </NuxtLink>
      </div>
    </UPageCard>
  </div>
</template>
