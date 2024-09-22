<template>
  <div class="p-4">
    <h5 class="text-center mb-5">Iniciar sesión</h5>
    <div class="mb-3">
      <span class="p-float-label">
        <InputText id="email" v-model="email" class="w-full" />
        <label for="email">Correo electrónico</label>
      </span>
    </div>
    <div class="mb-3">
      <span class="p-float-label">
        <Password
          id="password"
          v-model="password"
          class="w-full"
          inputClass="w-full"
          :feedback="false"
          :toggleMask="true"
        />
        <label for="password">Contraseña</label>
      </span>
    </div>
    <div class="flex align-items-center justify-content-between mb-5">
      <div class="flex align-items-center">
        <Checkbox id="rememberMe" v-model="rememberMe" :binary="true" class="mr-2" />
        <label for="rememberMe">Recordarme</label>
      </div>
      <a
        class="font-medium no-underline ml-2 text-right cursor-pointer"
        style="color: var(--primary-color)"
        >¿Olvidaste tu contraseña?</a
      >
    </div>
    <Button
      label="Iniciar sesión"
      class="w-full"
      @click="login"
      :loading="loadingStore.isLoading"
    />
    <div class="text-center mt-5">
      <router-link
        :to="{ name: 'signup' }"
        class="font-medium no-underline cursor-pointer"
        style="color: var(--primary-color)"
      >
        ¿No tienes una cuenta? Regístrate
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import PocketBase from 'pocketbase'
import { useLoadingStore } from '../stores/loadingStore'
import { useToast } from 'primevue/usetoast'

const pb = new PocketBase('https://green-brothers.pockethost.io')
const loadingStore = useLoadingStore()
const toast = useToast()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const login = async () => {
  loadingStore.startLoading()
  try {
    await pb.collection('users').authWithPassword(email.value, password.value)
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Inicio de sesión exitoso',
      life: 3000
    })
    router.push('/home')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al iniciar sesión. Por favor, verifica tus credenciales.',
      life: 3000
    })
  } finally {
    loadingStore.stopLoading()
  }
}
</script>
