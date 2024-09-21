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
            <Button label="Iniciar sesión" class="w-full" @click="login" />
          </div>

          <div v-else>
            <div class="mb-3">
              <span class="p-float-label">
                <InputText id="name" v-model="name" class="w-full" />
                <label for="name">Nombre completo</label>
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
            <Button label="Registrarse" class="w-full" @click="signup" />
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
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://green-brothers.pockethost.io')

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

const toggleForm = () => {
  isLogin.value = !isLogin.value
}

const login = async () => {
  try {
    await pb.collection('users').authWithPassword(email.value, password.value)
    if (rememberMe.value) {
      // Si el usuario quiere ser recordado, puedes guardar el token de forma persistente
      localStorage.setItem('pocketbase_auth', pb.authStore.exportToCookie())
    }

    // Redirigir al usuario a la página de inicio o dashboard
    router.push('/about')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert('Error al iniciar sesión. Por favor, verifica tus credenciales.')
  }
}

const logout = () => {
  pb.authStore.clear()
  // Aquí puedes manejar el estado de logout en tu aplicación
  // Por ejemplo, redirigir al usuario a la página de inicio
  router.push('/')
}

const signup = async () => {
  try {
    const data = {
      username: name.value,
      email: emailSignup.value,
      emailVisibility: true,
      password: passwordSignup.value,
      passwordConfirm: confirmPassword.value,
      name: name.value
    }

    const record = await pb.collection('users').create(data)
    console.log('Usuario registrado:', record)

    await pb.collection('users').requestVerification(emailSignup.value)

    alert('Registro exitoso. Por favor, verifica tu correo electrónico.')
    isLogin.value = true
  } catch (error) {
    console.error('Error al registrar:', error)
    alert('Error al registrar. Por favor, intenta de nuevo.')
  }
}
</script>
