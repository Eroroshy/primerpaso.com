<template>
  <div>
    <div class="py-20 px-5">
      <h1 class="mb-12 text-5xl text-primary font-bold text-center">
        Jobs
      </h1>

      <NuxtLink
        to="/"
        class="inline-block py-4 px-8 bg-teal-900 text-white rounded text-center"
      >
        FFIERERI
      </NuxtLink>
    </div>

    <div class="py-10 px-6">
      <h2 class="mb-8 text-2xl text-center">
        Browse Jobs by Category
      </h2>

      <div class="py-10 px-6">
        <h2 class="mb-8 text-2xl text-center">
          Newest Jobs
        </h2>

        <div class="space-y-4">
          <div class="p-6 flex items-center justify-between bg-gray-100 rounded-xl">
            <div>
              <h3 class="mb-2 text-xl font-semibold">
                The job position
              </h3>
              <p class="text-gray-600">
                Company Name
              </p>
            </div>

            <div>
              <p class="mb-2">
                Worldwide
              </p>
              <p>$90-120k/year</p>
            </div>

            <div>
              <p>Posted yesterday</p>
            </div>

            <div>
              <NuxtLink
                to="/browse/1"
                class="py-4 px-6 bg-teal-700 text-white rounded-xl"
              >
                Apply Now
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
