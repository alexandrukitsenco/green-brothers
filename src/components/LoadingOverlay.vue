<!-- Overlay.vue -->
<template>
  <div v-if="loadingStore.getLoadingState" class="fixed top-0 left-0 h-screen w-screen bg-black/50">
    <div class="flex items-center justify-center h-full w-full">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '../stores/loadingStore'
import ProgressSpinner from 'primevue/progressspinner'

const loadingStore = useLoadingStore()
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
:deep(.p-overlaypanel) {
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.p-progress-spinner) {
  width: 50px;
  height: 50px;
}

:deep(.p-progress-spinner-circle) {
  stroke: #ffffff;
  stroke-width: 3;
}
</style>
