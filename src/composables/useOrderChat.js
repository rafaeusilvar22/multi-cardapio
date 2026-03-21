import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from 'src/stores/auth'

const SOCKET_URL = process.env.BACK_END_BASE_URL || 'http://localhost:3018'

export function useOrderChat(senderType = 'workspace') {
  const messages = ref([])
  const connected = ref(false)
  const connecting = ref(false)
  const chatClosed = ref(false)

  let socket = null
  let currentOrderUuid = null

  function connect(orderUuid) {
    if (socket) disconnect()

    currentOrderUuid = orderUuid
    connecting.value = true
    messages.value = []

    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })

    socket.on('connect', () => {
      const payload = { order_uuid: orderUuid, sender_type: senderType }

      if (senderType === 'workspace') {
        const authStore = useAuthStore()
        payload.token = authStore.token
      }

      socket.emit('join_order', payload)
    })

    socket.on('message_history', (history) => {
      messages.value = history
      connected.value = true
      connecting.value = false
    })

    socket.on('chat_closed', () => {
      chatClosed.value = true
      connected.value = false
    })

    socket.on('message', (msg) => {
      messages.value.push(msg)
    })

    socket.on('error', (err) => {
      console.error('[OrderChat] error:', err)
      connecting.value = false
    })

    socket.on('disconnect', () => {
      connected.value = false
      connecting.value = false
    })
  }

  function sendMessage(content, senderName) {
    if (!socket || !currentOrderUuid || !content?.trim()) return

    const payload = {
      order_uuid: currentOrderUuid,
      content: content.trim(),
      sender_type: senderType,
      sender_name: senderName,
    }

    if (senderType === 'workspace') {
      const authStore = useAuthStore()
      payload.token = authStore.token
    }

    socket.emit('send_message', payload)
  }

  function disconnect() {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    connected.value = false
    connecting.value = false
    chatClosed.value = false
    messages.value = []
    currentOrderUuid = null
  }

  return { messages, connected, connecting, chatClosed, connect, sendMessage, disconnect }
}
