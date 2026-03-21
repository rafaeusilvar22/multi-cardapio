<template>
  <q-page padding class="track-page">
    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="48px" />
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="flex flex-center q-py-xl">
      <q-banner class="bg-negative text-white" rounded style="max-width: 400px">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
      </q-banner>
    </div>

    <template v-else-if="order">
      <div class="row justify-center">
        <div class="col-12 col-sm-10 col-md-7 q-gutter-y-md">

          <!-- Status do Pedido -->
          <q-card flat bordered>
            <q-card-section class="bg-primary text-white q-py-md">
              <div class="text-h6 text-weight-bold">Pedido #{{ order.order_uuid?.slice(0, 8).toUpperCase() }}</div>
              <div class="text-caption" style="opacity: 0.85">Acompanhe o status do seu pedido</div>
            </q-card-section>

            <q-card-section class="flex flex-center q-py-lg">
              <div class="text-center">
                <q-icon :name="statusInfo.icon" :color="statusInfo.color" size="56px" />
                <div class="text-h6 text-weight-bold q-mt-sm" :class="`text-${statusInfo.color}`">
                  {{ statusInfo.label }}
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">{{ statusInfo.description }}</div>
              </div>
            </q-card-section>

            <!-- Progresso -->
            <q-card-section class="q-pt-none q-pb-lg">
              <div class="status-steps row justify-between items-center q-px-md">
                <div
                  v-for="(step, i) in statusSteps"
                  :key="step.value"
                  class="step-item column items-center"
                >
                  <q-icon
                    :name="step.icon"
                    size="22px"
                    :color="isStepActive(step.value) ? 'primary' : 'grey-4'"
                  />
                  <div
                    class="text-caption q-mt-xs"
                    :class="isStepActive(step.value) ? 'text-primary text-weight-medium' : 'text-grey-5'"
                    style="font-size: 0.65rem; text-align: center"
                  >
                    {{ step.label }}
                  </div>
                  <div
                    v-if="i < statusSteps.length - 1"
                    class="step-line"
                    :class="isStepActive(step.value) ? 'step-line-active' : ''"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Resumo do Pedido -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Resumo</div>
              <div class="row justify-between text-body2 q-mb-xs">
                <span class="text-grey-7">Itens</span>
                <span>{{ order.items?.length || 0 }}</span>
              </div>
              <div class="row justify-between text-body2 q-mb-xs">
                <span class="text-grey-7">Horário</span>
                <span>{{ formatTime(order.created_at) }}</span>
              </div>
              <q-separator class="q-my-sm" />
              <div class="row justify-between text-weight-bold">
                <span>Total</span>
                <span class="text-positive">{{ formatCurrency(parseFloat(order.total_amount)) }}</span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Chat com o estabelecimento -->
          <q-card flat bordered>
            <q-card-section class="q-pb-sm">
              <div class="row items-center q-gutter-sm">
                <q-icon name="chat" color="primary" size="20px" />
                <div class="text-subtitle2 text-weight-bold">Fale com o estabelecimento</div>
                <q-badge
                  v-if="connected"
                  color="positive"
                  label="online"
                  style="font-size: 0.6rem"
                />
                <q-badge
                  v-else-if="connecting"
                  color="warning"
                  label="conectando..."
                  style="font-size: 0.6rem"
                />
              </div>
            </q-card-section>

            <q-separator />

            <!-- Pede o nome antes de entrar no chat -->
            <q-card-section v-if="!customerName">
              <div class="text-body2 text-grey-7 q-mb-md">
                Como devemos te chamar no chat?
              </div>
              <div class="row q-gutter-sm">
                <div class="col">
                  <q-input
                    v-model="nameInput"
                    outlined
                    dense
                    placeholder="Seu nome"
                    @keyup.enter="enterChat"
                  />
                </div>
                <q-btn
                  color="primary"
                  label="Entrar"
                  unelevated
                  :disable="!nameInput.trim()"
                  @click="enterChat"
                />
              </div>
            </q-card-section>

            <!-- Chat ativo -->
            <template v-else>
              <!-- Mensagens -->
              <div class="chat-messages q-pa-sm" ref="messagesContainer">
                <div v-if="connecting" class="flex flex-center q-py-lg">
                  <q-spinner color="primary" size="28px" />
                </div>

                <div v-else-if="!messages.length" class="flex flex-center column q-py-lg text-grey-5">
                  <q-icon name="chat_bubble_outline" size="36px" class="q-mb-xs" />
                  <span class="text-caption">Nenhuma mensagem ainda. Diga olá!</span>
                </div>

                <template v-else>
                  <div
                    v-for="msg in messages"
                    :key="msg.uuid"
                    class="q-mb-sm"
                    :class="msg.sender_type === 'customer' ? 'msg-right' : 'msg-left'"
                  >
                    <div
                      class="msg-bubble"
                      :class="msg.sender_type === 'customer' ? 'bubble-customer' : 'bubble-workspace'"
                    >
                      <div class="msg-sender">{{ msg.sender_name }}</div>
                      <div class="msg-content">{{ msg.content }}</div>
                      <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
                    </div>
                  </div>
                </template>
              </div>

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
            </template>
          </q-card>

        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderChat } from 'src/composables/useOrderChat'
import { PublicService } from 'src/services/PublicService'
import { formatCurrency, formatTime } from 'src/utils/globalFunctions'

defineOptions({ name: 'TrackOrderPage' })

const route = useRoute()
const slug = route.params.companySlug
const orderUuid = route.params.orderUuid

const order = ref(null)
const loading = ref(true)
const error = ref(null)

const nameInput = ref('')
const customerName = ref('')
const newMessage = ref('')
const messagesContainer = ref(null)

const { messages, connected, connecting, chatClosed, connect, sendMessage, disconnect } = useOrderChat('customer')

const statusSteps = [
  { value: 'pending',    label: 'Recebido',   icon: 'receipt' },
  { value: 'confirmed',  label: 'Confirmado', icon: 'check_circle' },
  { value: 'preparing',  label: 'Preparando', icon: 'restaurant' },
  { value: 'ready',      label: 'Pronto',     icon: 'done_all' },
  { value: 'delivered',  label: 'Entregue',   icon: 'celebration' },
]

const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered']

const statusMap = {
  pending:    { label: 'Pedido Recebido',   icon: 'receipt_long',    color: 'grey',     description: 'Aguardando confirmação do estabelecimento.' },
  confirmed:  { label: 'Confirmado',         icon: 'check_circle',    color: 'info',     description: 'O estabelecimento confirmou seu pedido!' },
  preparing:  { label: 'Sendo Preparado',    icon: 'restaurant',      color: 'warning',  description: 'Seu pedido está sendo preparado.' },
  ready:      { label: 'Pronto!',            icon: 'done_all',        color: 'teal',     description: 'Seu pedido está pronto para retirada ou entrega.' },
  delivering: { label: 'Saiu para Entrega',  icon: 'delivery_dining', color: 'orange',   description: 'Seu pedido está a caminho!' },
  delivered:  { label: 'Entregue',           icon: 'celebration',     color: 'positive', description: 'Pedido entregue. Bom apetite!' },
  cancelled:  { label: 'Cancelado',          icon: 'cancel',          color: 'negative', description: 'Este pedido foi cancelado.' },
}

const statusInfo = computed(() => statusMap[order.value?.status] || statusMap.pending)

const isStepActive = (stepValue) => {
  const currentIndex = statusOrder.indexOf(order.value?.status)
  const stepIndex = statusOrder.indexOf(stepValue)
  return stepIndex <= currentIndex
}

const enterChat = () => {
  if (!nameInput.value.trim()) return
  customerName.value = nameInput.value.trim()
  connect(orderUuid)
}

const handleSend = () => {
  if (!newMessage.value.trim()) return
  sendMessage(newMessage.value, customerName.value)
  newMessage.value = ''
}

watch(messages, () => {
  nextTick(() => {
    const el = messagesContainer.value
    if (el) el.scrollTop = el.scrollHeight
  })
}, { deep: true })

onMounted(async () => {
  try {
    const data = await PublicService.trackOrder(slug, orderUuid)
    order.value = data
  } catch {
    error.value = 'Pedido não encontrado. Verifique o link e tente novamente.'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => disconnect())
</script>

<style lang="scss" scoped>
.track-page {
  max-width: 100%;
}

.status-steps {
  position: relative;
}

.step-item {
  position: relative;
  flex: 1;
}

.step-line {
  position: absolute;
  top: 11px;
  left: 60%;
  width: 80%;
  height: 2px;
  background: #e0e0e0;
}

.step-line-active {
  background: var(--q-primary);
}

.chat-messages {
  height: 280px;
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

.bubble-customer {
  background: var(--q-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble-workspace {
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
