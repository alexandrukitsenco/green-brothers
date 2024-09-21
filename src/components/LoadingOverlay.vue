<template>
  <div v-if="loadingStore.getLoadingState" class="fixed top-0 left-0 h-screen w-screen bg-black/50">
    <div class="flex items-center justify-center h-full w-full">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../stores/loadingStore'
import ProgressSpinner from 'primevue/progressspinner'

const loadingStore = useLoadingStore()
</script>
