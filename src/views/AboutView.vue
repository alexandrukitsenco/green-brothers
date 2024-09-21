<template>
  <div class="flex flex-col gap-4 mt-16">
    <h1>Hola mon</h1>
    <DatePicker v-model="date" :minDate="minDate" />
    <Card v-for="(turno, tipo) in diaConTurnos.turnos" :key="tipo">
      <template #header>
        <div class="bg-green-600 flex justify-between items-center p-3">
          <h2>Turno de {{ tipo }}</h2>
          <Button @click="apuntarseATurno(tipo)"> Apúntate</Button>
        </div>
      </template>
      <template #content>
        <div class="flex gap-3 flex-wrap">
          <Card v-for="usuario in turno.usuarios" :key="usuario.name" class="w-28 user-card">
            <template #header>
              <img :src="usuario.avatar" :alt="usuario.name" />
            </template>
            <template #footer>
              <h3 class="text-sm">{{ usuario.name }}</h3>
            </template>
          </Card>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Card from 'primevue/card'
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://green-brothers.pockethost.io')

type TurnoTipo = 'mañana' | 'tarde' | 'noche'

interface Usuario {
  name: string
  avatar: string
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

const diaConTurnos = ref<DiaConTurnos>({
  fecha: '',
  turnos: {
    mañana: { usuarios: [] },
    tarde: { usuarios: [] },
    noche: { usuarios: [] }
  }
})

const formatDate = (date: Date): string => {
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
  return adjustedDate.toISOString().split('T')[0]
}

const fetchUsersForDate = async () => {
  const selectedDate = date.value.toISOString().split('T')[0]
  diaConTurnos.value.fecha = selectedDate

  console.log(selectedDate)

  try {
    const records = await pb.collection('user_workout_logs').getFullList({
      filter: `date = "${selectedDate}"`,
      expand: 'user'
    })

    // Reiniciar los usuarios para cada turno
    diaConTurnos.value.turnos = {
      mañana: { usuarios: [] },
      tarde: { usuarios: [] },
      noche: { usuarios: [] }
    }

    records.forEach((record) => {
      const usuario: Usuario = {
        name: record.username,
        avatar: record.userProfileImage
          ? record.userProfileImage
          : 'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg'
      }
      diaConTurnos.value.turnos[record.turno as TurnoTipo].usuarios.push(usuario)
    })
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const apuntarseATurno = async (turno: TurnoTipo) => {
  if (!pb.authStore.isValid || !pb.authStore.model) {
    alert('Por favor, inicia sesión para apuntarte a un turno.')
    return
  }

  const selectedDate = formatDate(date.value)

  const data = {
    turno: turno,
    date: selectedDate,
    username: pb.authStore.model.username,
    userProfileImage: pb.authStore.model.avatar
      ? `https://green-brothers.pockethost.io/api/files/_pb_users_auth_/${pb.authStore.model.id}/${pb.authStore.model.avatar}`
      : 'https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg',
    user_id: pb.authStore.model.id
  }

  try {
    const record = await pb.collection('user_workout_logs').create(data)
    console.log('Usuario apuntado:', record)

    await fetchUsersForDate()

    alert('Te has apuntado correctamente al turno de ' + turno)
  } catch (error) {
    console.error('Error al apuntarse:', error)
    alert('Error al apuntarse. Por favor, intenta de nuevo.')
  }
}

onMounted(() => {
  fetchUsersForDate()
})

watch(date, fetchUsersForDate)
</script>

<style>
.user-card {
  @apply !bg-green-900 overflow-hidden rounded-md;
}
.user-card .p-card-body {
  @apply !p-2 flex items-center justify-center;
}
</style>
