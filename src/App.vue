<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <div class="container mx-auto px-4">
    <RouterView />
    <Toast position="bottom-left" />
  </div>
  <LoadingOverlay class="z-50" />
</template>
<style>
.p-toast {
  @apply !w-full !p-4 !bottom-0 !left-0;
}
</style>
