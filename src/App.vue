<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
</script>

<template>
  <div class="container mx-auto px-4">
    <RouterView />
    <LoadingOverlay />
  </div>
</template>
