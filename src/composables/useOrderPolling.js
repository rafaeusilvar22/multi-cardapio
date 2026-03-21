import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from 'src/stores/auth'

const SOCKET_URL = process.env.BACK_END_BASE_URL || 'http://localhost:3018'

// Singleton state — shared across all composable instances
const orders = ref([])
const newOrdersCount = ref(0)
const lastPolledAt = ref(0)
const unreadMessageOrders = ref(new Set())
const lastEvent = ref(null) // { type: 'new_order' | 'order_status_changed', at: timestamp }

let socket = null

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const schedule = (freq, startTime, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime)
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration)
      osc.start(ctx.currentTime + startTime)
      osc.stop(ctx.currentTime + startTime + duration)
    }
    schedule(880, 0, 0.3)
    schedule(1100, 0.15, 0.4)
  } catch {
    // AudioContext not available
  }
}

export const useOrderPolling = () => {
  const startPolling = () => {
    if (socket) return

    const authStore = useAuthStore()

    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })

    socket.on('connect', () => {
      socket.emit('join_workspace', { token: authStore.token })
    })

    socket.on('new_order', () => {
      newOrdersCount.value += 1
      playNotificationSound()
      lastPolledAt.value = Date.now()
      lastEvent.value = { type: 'new_order', at: Date.now() }
    })

    socket.on('order_status_changed', () => {
      lastEvent.value = { type: 'order_status_changed', at: Date.now() }
    })

    socket.on('new_customer_message', ({ order_uuid }) => {
      unreadMessageOrders.value = new Set([...unreadMessageOrders.value, order_uuid])
    })

    socket.on('disconnect', () => {})
  }

  const stopPolling = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  const clearNewOrders = () => {
    newOrdersCount.value = 0
  }

  const markOrderRead = (orderUuid) => {
    const updated = new Set(unreadMessageOrders.value)
    updated.delete(orderUuid)
    unreadMessageOrders.value = updated
  }

  return { orders, newOrdersCount, lastPolledAt, lastEvent, unreadMessageOrders, clearNewOrders, markOrderRead, startPolling, stopPolling }
}
