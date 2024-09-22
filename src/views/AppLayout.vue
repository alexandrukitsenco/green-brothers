<template>
  <div class="layout-wrapper">
    <Toolbar class="fixed top-0 left-0 w-full z-10 shadow-md !rounded-none">
      <template #start>
        <span class="text-xl font-bold text-green-700">GreenBrothers</span>
      </template>
      <template #end>
        <Button icon="pi pi-sign-out" @click="logout" text rounded aria-label="Logout" />
      </template>
    </Toolbar>
    <div class="content-wrapper pt-20">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import PocketBase from 'pocketbase'

const router = useRouter()
const toast = useToast()
const pb = new PocketBase('https://green-brothers.pockethost.io')

const logout = () => {
  pb.authStore.clear()
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Sesión cerrada correctamente',
    life: 3000
  })
  router.push('/login')
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1;
}
</style>
