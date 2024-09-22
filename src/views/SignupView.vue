<template>
  <div class="p-4 flex flex-col gap-8">
    <h5 class="text-center mb-5">Registrarse</h5>
    <FloatLabel>
      <InputText id="name" v-model="name" class="w-full" />
      <label for="name">Apodo</label>
    </FloatLabel>
    <FloatLabel>
      <InputText id="emailSignup" v-model="emailSignup" class="w-full" />
      <label for="emailSignup">Correo electrónico</label>
    </FloatLabel>
    <FloatLabel>
      <Password
        id="passwordSignup"
        v-model="passwordSignup"
        class="w-full"
        inputClass="w-full"
        :toggleMask="true"
      />
      <label for="passwordSignup">Contraseña</label>
    </FloatLabel>
    <FloatLabel>
      <Password
        id="confirmPassword"
        v-model="confirmPassword"
        class="w-full"
        inputClass="w-full"
        :feedback="false"
        :toggleMask="true"
      />
      <label for="confirmPassword">Confirmar contraseña</label>
    </FloatLabel>
    <div class="flex items-center gap-1 text-sm">
      <Checkbox id="acceptTerms" v-model="acceptTerms" :binary="true" class="mr-2" />
      <label for="acceptTerms">Acepto los términos y condiciones</label>
    </div>
    <div>
      <Button
        label="Registrarse"
        class="w-full"
        @click="signup"
        :loading="loadingStore.isLoading"
      />
      <div class="text-center mt-3">
        <router-link
          :to="{ name: 'login' }"
          class="font-medium no-underline cursor-pointer"
          style="color: var(--primary-color)"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import { useRouter } from 'vue-router'
import PocketBase from 'pocketbase'
import { ClientResponseError } from 'pocketbase'
import { useLoadingStore } from '../stores/loadingStore'
import { useToast } from 'primevue/usetoast'

const pb = new PocketBase('https://green-brothers.pockethost.io')
const loadingStore = useLoadingStore()
const toast = useToast()
const router = useRouter()

const name = ref('')
const emailSignup = ref('')
const passwordSignup = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const signup = async () => {
  if (!acceptTerms.value) {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debes aceptar los términos y condiciones para registrarte.',
      life: 3000
    })
    return
  }

  loadingStore.startLoading()
  try {
    const data = {
      username: name.value,
      email: emailSignup.value,
      emailVisibility: true,
      password: passwordSignup.value,
      passwordConfirm: confirmPassword.value,
      name: name.value
    }

    await pb.collection('users').create(data)

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Registro exitoso. Por favor, verifica tu correo electrónico.',
      life: 3000
    })
    router.push({ name: 'login' })
  } catch (error) {
    if (error instanceof ClientResponseError) {
      let errorMessage = 'Error al registrar:\n'
      const errorData = error.data.data
      if (errorData.email) {
        errorMessage += `- Email: ${errorData.email.message}\n`
      }
      if (errorData.password) {
        errorMessage += `- Contraseña: ${errorData.password.message}\n`
      }
      if (errorData.username) {
        errorMessage += `- Apodo: ${errorData.username.message}\n`
      }
      toast.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: errorMessage,
        life: 5000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al registrar. Por favor, intenta de nuevo.',
        life: 3000
      })
    }
  } finally {
    loadingStore.stopLoading()
  }
}
</script>
