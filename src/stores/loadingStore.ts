import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  function setLoading(value: boolean) {
    isLoading.value = value
  }

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  const getLoadingState = computed(() => isLoading.value)

  return {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    getLoadingState
  }
})
