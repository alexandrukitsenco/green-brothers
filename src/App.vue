<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <div class="container mx-auto px-4">
    <RouterView />
    <Toast />
  </div>
  <LoadingOverlay />
</template>
<style>
.p-toast {
  @apply !w-full !p-4 !top-0 !right-0;
}
</style>
