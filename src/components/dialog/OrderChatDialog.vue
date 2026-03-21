<template>
  <q-dialog v-model="dialog" persistent @hide="onHide">
    <q-card class="chat-card" style="width: 420px; max-width: 95vw; display: flex; flex-direction: column">
      <!-- Cabeçalho -->
      <q-card-section class="bg-primary text-white q-py-sm q-px-md">
        <div class="row items-center justify-between no-wrap">
          <div class="row items-center gap-sm">
            <q-icon name="chat" size="20px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2 text-weight-bold">Chat — Pedido #{{ order.id }}</div>
              <div class="text-caption" style="opacity: 0.8">
                <template v-if="connecting">Conectando...</template>
                <template v-else-if="connected">
                  <q-icon name="circle" size="10px" color="positive" /> Conectado
                </template>
                <template v-else>Desconectado</template>
              </div>
            </div>
          </div>
          <q-btn flat round dense icon="close" color="white" size="sm" @click="dialog = false" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Mensagens -->
      <q-card-section class="chat-messages q-pa-sm" ref="messagesContainer">
        <!-- Loading inicial -->
        <div v-if="connecting" class="flex flex-center q-py-xl">
          <q-spinner color="primary" size="32px" />
        </div>

        <!-- Sem mensagens -->
        <div
          v-else-if="!messages.length"
          class="flex flex-center column q-py-xl text-grey-5"
        >
          <q-icon name="chat_bubble_outline" size="40px" class="q-mb-sm" />
          <span class="text-caption">Nenhuma mensagem ainda</span>
        </div>

        <!-- Lista de mensagens -->
        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.uuid"
            class="q-mb-sm"
            :class="msg.sender_type === 'workspace' ? 'msg-right' : 'msg-left'"
          >
            <div class="msg-bubble" :class="msg.sender_type === 'workspace' ? 'bubble-workspace' : 'bubble-customer'">
              <div class="msg-sender">{{ msg.sender_name }}</div>
              <div class="msg-content">{{ msg.content }}</div>
              <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
            </div>
          </div>
        </template>
      </q-card-section>

      <q-separator />

      <!-- Chat encerrado -->
      <q-card-section v-if="chatClosed" class="q-pa-sm">
        <q-banner class="bg-grey-2 text-grey-7 rounded-borders" dense>
          <template v-slot:avatar>
            <q-icon name="lock" color="grey-6" />
          </template>
          Chat encerrado — pedido finalizado ou cancelado.
        </q-banner>
      </q-card-section>

      <!-- Input -->
      <q-card-section v-else class="q-pa-sm">
        <div class="row items-center q-gutter-xs">
          <div class="col">
            <q-input
              v-model="newMessage"
              outlined
              dense
              placeholder="Digite uma mensagem..."
              :disable="!connected"
              @keyup.enter="handleSend"
              autogrow
              :max-height="80"
            />
          </div>
          <q-btn
            round
            color="primary"
            icon="send"
            size="sm"
            :disable="!connected || !newMessage.trim()"
            @click="handleSend"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useOrderChat } from 'src/composables/useOrderChat'
import { useAuthStore } from 'src/stores/auth'
import { formatTime } from 'src/utils/globalFunctions'

const dialog = defineModel({ type: Boolean, default: false })

const { order } = defineProps({
  order: { type: Object, required: true },
})

const authStore = useAuthStore()
const { messages, connected, connecting, chatClosed, connect, sendMessage, disconnect } = useOrderChat()

const newMessage = ref('')
const messagesContainer = ref(null)

const senderName = authStore.profile?.name || authStore.user?.name || 'Atendente'

watch(dialog, (val) => {
  if (val && order?.uuid) {
    connect(order.uuid)
  }
})

watch(messages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

function handleSend() {
  if (!newMessage.value.trim()) return
  sendMessage(newMessage.value, senderName)
  newMessage.value = ''
}

function onHide() {
  disconnect()
  newMessage.value = ''
}

function scrollToBottom() {
  const el = messagesContainer.value?.$el || messagesContainer.value
  if (el) el.scrollTop = el.scrollHeight
}

</script>

<style lang="scss" scoped>
.chat-card {
  border-radius: 12px;
}

.chat-messages {
  height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.msg-left {
  display: flex;
  justify-content: flex-start;
}

.msg-right {
  display: flex;
  justify-content: flex-end;
}

.msg-bubble {
  max-width: 75%;
  border-radius: 12px;
  padding: 8px 12px;
  word-break: break-word;
}

.bubble-workspace {
  background: #1976d2;
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble-customer {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.msg-sender {
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 2px;
  opacity: 0.75;
}

.msg-content {
  font-size: 0.875rem;
  line-height: 1.4;
}

.msg-time {
  font-size: 0.65rem;
  margin-top: 4px;
  opacity: 0.65;
  text-align: right;
}
</style>
