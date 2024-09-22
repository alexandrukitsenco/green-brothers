<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="max-w-96">
      <template #content>
        <div class="p-4">
          <h5 class="text-center mb-5">{{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}</h5>

          <div v-if="isLogin">
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
          </div>

          <div v-else>
            <div class="mb-3">
              <span class="p-float-label">
                <InputText id="name" v-model="name" class="w-full" />
                <label for="name">Apodo</label>
              </span>
            </div>
            <div class="mb-3">
              <span class="p-float-label">
                <InputText id="emailSignup" v-model="emailSignup" class="w-full" />
                <label for="emailSignup">Correo electrónico</label>
              </span>
            </div>
            <div class="mb-3">
              <span class="p-float-label">
                <Password
                  id="passwordSignup"
                  v-model="passwordSignup"
                  class="w-full"
                  inputClass="w-full"
                  :toggleMask="true"
                />
                <label for="passwordSignup">Contraseña</label>
              </span>
            </div>
            <div class="mb-3">
              <span class="p-float-label">
                <Password
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="w-full"
                  inputClass="w-full"
                  :feedback="false"
                  :toggleMask="true"
                />
                <label for="confirmPassword">Confirmar contraseña</label>
              </span>
            </div>
            <div class="flex align-items-center justify-content-between mb-5">
              <div class="flex align-items-center">
                <Checkbox id="acceptTerms" v-model="acceptTerms" :binary="true" class="mr-2" />
                <label for="acceptTerms">Acepto los términos y condiciones</label>
              </div>
            </div>
            <Button
              label="Registrarse"
              class="w-full"
              @click="signup"
              :loading="loadingStore.isLoading"
            />
          </div>

          <div class="text-center mt-5">
            <a
              @click="toggleForm"
              class="font-medium no-underline cursor-pointer"
              style="color: var(--primary-color)"
            >
              {{
                isLogin
                  ? '¿No tienes una cuenta? Regístrate'
                  : '¿Ya tienes una cuenta? Inicia sesión'
              }}
            </a>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import PocketBase from 'pocketbase'
import { ClientResponseError } from 'pocketbase'
import { useLoadingStore } from '../stores/loadingStore'
import { useToast } from 'primevue/usetoast'

const pb = new PocketBase('https://green-brothers.pockethost.io')
const loadingStore = useLoadingStore()
const toast = useToast()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const name = ref('')
const emailSignup = ref('')
const passwordSignup = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const router = useRouter()

onMounted(() => {
  if (pb.authStore.isValid) {
    router.push('/home')
  } else {
    const storedAuth = localStorage.getItem('pocketbase_auth')
    if (storedAuth) {
      pb.authStore.loadFromCookie(storedAuth)
      if (pb.authStore.isValid) {
        router.push('/home')
      }
    }
  }
})

const toggleForm = () => {
  isLogin.value = !isLogin.value
}

const login = async () => {
  loadingStore.startLoading()
  try {
    await pb.collection('users').authWithPassword(email.value, password.value)
    if (rememberMe.value) {
      localStorage.setItem('pocketbase_auth', pb.authStore.exportToCookie())
    }
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
    isLogin.value = true
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
