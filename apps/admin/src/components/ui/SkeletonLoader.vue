<template>
  <div class="animate-pulse">
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr>
            <th v-for="i in columns" :key="i" class="px-6 py-4 text-left">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in rows" :key="row">
            <td v-for="col in columns" :key="col" class="px-6 py-4">
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded" :class="col === 1 ? 'w-full' : 'w-2/3'"></div>
                <div v-if="col === 1" class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
    columns?: number
  }>(),
  {
    rows: 5,
    columns: 7,
  }
)
</script>
