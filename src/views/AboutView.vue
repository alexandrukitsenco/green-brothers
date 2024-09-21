<template>
  <div class="flex flex-col gap-4 mt-16">
    <h1>Hola mon</h1>
    <DatePicker v-model="date" :minDate="minDate" />
    <Card v-for="(turno, tipo) in diaConTurnos.turnos" :key="tipo">
      <template #header>
        <div class="bg-green-600 flex justify-between items-center p-3">
          <h2>Turno de {{ tipo }}</h2>
          <Button> apuntate</Button>
        </div>
      </template>
      <template #content>
        <div class="flex gap-3 flex-wrap">
          <Card v-for="usuario in turno.usuarios" :key="usuario.nombre" class="w-28 user-card">
            <template #header>
              <img :src="usuario.fotoUrl" :alt="usuario.nombre" />
            </template>
            <template #footer>
              <h3 class="text-sm">{{ usuario.nombre }}</h3>
            </template>
          </Card>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Card from 'primevue/card'

type TurnoTipo = 'mañana' | 'tarde' | 'noche'

interface Usuario {
  nombre: string
  fotoUrl: string
}

interface Turno {
  usuarios: Usuario[]
}

interface DiaConTurnos {
  fecha: string
  turnos: {
    [key in TurnoTipo]: Turno
  }
}

const date = ref(new Date())
const minDate = ref(new Date())

const diaConTurnos: DiaConTurnos = {
  fecha: '2023-09-21',
  turnos: {
    mañana: {
      usuarios: [
        {
          nombre: 'Juan Pérez',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        },
        {
          nombre: 'María García',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        }
      ]
    },
    tarde: {
      usuarios: [
        {
          nombre: 'Carlos Rodríguez',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        },
        {
          nombre: 'Ana Martínez',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        },
        {
          nombre: 'Luis Sánchez',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        }
      ]
    },
    noche: {
      usuarios: [
        {
          nombre: 'Laura Fernández',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        },
        {
          nombre: 'Pedro Gómez',
          fotoUrl:
            'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
        }
      ]
    }
  }
}
</script>
<style>
.user-card {
  @apply !bg-green-900 overflow-hidden rounded-md;
}
.user-card .p-card-body {
  @apply !p-2 flex items-center justify-center;
}
</style>
