<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <LoginForm />
      <div class="my-4 text-center text-sm text-gray-600 dark:text-gray-400">
        ¿No tienes una cuenta?
        <NuxtLink
          to="/register"
          class="text-blue-600 hover:underline"
        >
          Regístrate aquí
        </NuxtLink>
      </div>
    </UPageCard>
  </div>
</template>
