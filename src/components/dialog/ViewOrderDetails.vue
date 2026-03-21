<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="order-details-card" style="max-width: 550px; width: 100%">
      <!-- Cabeçalho -->
      <q-card-section class="bg-primary text-white q-px-lg">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h5 text-weight-bold">Pedido #{{ order.id }}</div>
            <div class="text-subtitle2 text-white" style="opacity: 0.9">
              Mesa {{ order.table_number }}
            </div>
          </div>
          <q-btn flat round dense icon="close" color="white" @click="dialog = false" size="md" />
        </div>

        <div>
          <q-badge
            :color="getStatusColor(order.status)"
            text-color="white"
            class="text-weight-bold q-px-md q-py-sm"
            style="font-size: 0.875rem"
          >
            {{ getStatusLabel(order.status) }}
          </q-badge>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="info-grid">
          <!-- Horário -->
          <div class="info-item">
            <div class="info-icon-wrapper bg-blue-1">
              <q-icon name="schedule" size="24px" color="primary" />
            </div>
            <div class="info-content">
              <div class="info-label">Horário</div>
              <div class="info-value">{{ order.time }}</div>
            </div>
          </div>

          <!-- Itens -->
          <div class="info-item">
            <div class="info-icon-wrapper bg-orange-1">
              <q-icon name="restaurant_menu" size="24px" color="orange" />
            </div>
            <div class="info-content">
              <div class="info-label">Quantidade</div>
              <div class="info-value">{{ order.items }} itens</div>
            </div>
          </div>

          <!-- Tipo de pedido -->
          <div class="info-item">
            <div class="info-icon-wrapper" :class="orderTypeStyle.bg">
              <q-icon :name="orderTypeStyle.icon" size="24px" :color="orderTypeStyle.color" />
            </div>
            <div class="info-content">
              <div class="info-label">Tipo</div>
              <div class="info-value">{{ orderTypeStyle.label }}</div>
            </div>
          </div>

          <!-- Origem -->
          <div class="info-item">
            <div class="info-icon-wrapper bg-purple-1">
              <q-icon
                :name="order.origin === 'menu' ? 'qr_code_2' : 'admin_panel_settings'"
                size="24px"
                color="purple"
              />
            </div>
            <div class="info-content">
              <div class="info-label">Origem</div>
              <div class="info-value">
                {{ order.origin === 'menu' ? 'Cardápio Digital' : 'Administrativo' }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Detalhes do Pedido -->
      <q-card-section class="q-pa-md q-pt-none">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Detalhes</div>

        <!-- Endereço de entrega -->
        <div v-if="order.order_type?.type === 'delivery' && order.order_type?.delivery_address" class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="delivery_dining" size="18px" color="orange" />
            <span class="text-weight-medium">Endereço de Entrega</span>
          </div>
          <div class="detail-content">
            <div>{{ order.order_type.delivery_address }}</div>
            <div v-if="order.order_type.delivery_latitude && order.order_type.delivery_longitude" class="q-mt-xs">
              <a
                :href="`https://www.google.com/maps?q=${order.order_type.delivery_latitude},${order.order_type.delivery_longitude}`"
                target="_blank"
                class="text-primary"
              >
                <q-icon name="map" size="13px" /> Ver no mapa
              </a>
            </div>
          </div>
        </div>

        <!-- Cliente -->
        <div v-if="order.customer" class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="person" size="18px" color="teal" />
            <span class="text-weight-medium">Cliente</span>
          </div>
          <div class="detail-content">
            <div>{{ order.customer.name }}</div>
            <div class="text-grey-6">
              <q-icon name="phone" size="12px" /> {{ order.customer.phone }}
            </div>
            <div v-if="order.customer.email" class="text-grey-6">
              <q-icon name="email" size="12px" /> {{ order.customer.email }}
            </div>
          </div>
        </div>

        <!-- Itens do Pedido -->
        <div v-if="order.items_list?.length" class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="list_alt" size="18px" color="primary" />
            <span class="text-weight-medium">Itens do Pedido</span>
          </div>
          <div
            v-for="item in order.items_list"
            :key="item.id"
            class="detail-content"
          >
            {{ item.quantity }}x — {{ formatCurrency(parseFloat(item.unit_price)) }} un
            <span v-if="item.notes" class="text-grey-6"> ({{ item.notes }})</span>
          </div>
        </div>

        <!-- Observações -->
        <div v-if="order.notes" class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="notes" size="18px" color="orange" />
            <span class="text-weight-medium">Observações</span>
          </div>
          <div class="detail-content">{{ order.notes }}</div>
        </div>

        <!-- Pagamento -->
        <div class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="payments" size="18px" color="purple" />
            <span class="text-weight-medium">Forma de Pagamento</span>
          </div>
          <div class="detail-content">{{ order.payment_method }}</div>
        </div>

        <!-- Total -->
        <div class="total-box">
          <div class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Total</div>
            <div class="text-h5 text-weight-bold text-positive">
              {{ formatCurrency(order.total) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from 'src/utils/globalFunctions'

const dialog = defineModel({
  type: Boolean,
  default: false,
})

const { order } = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const orderTypeStyle = computed(() => {
  const type = order.order_type?.type
  if (type === 'pickup') return { icon: 'store', color: 'teal', bg: 'bg-teal-1', label: 'Retirada no local' }
  if (type === 'delivery') return { icon: 'delivery_dining', color: 'orange', bg: 'bg-orange-1', label: 'Delivery' }
  return { icon: 'table_restaurant', color: 'primary', bg: 'bg-blue-1', label: `Mesa ${order.order_type?.table_number || '-'}` }
})

const getStatusColor = (status) => {
  const colors = {
    pending: 'grey',
    confirmed: 'info',
    preparing: 'warning',
    ready: 'teal',
    delivering: 'orange',
    delivered: 'positive',
    cancelled: 'negative',
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivering: 'Em Entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}
</script>

<style lang="scss" scoped>
.order-details-card {
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.info-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.detail-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px 12px;
  border-left: 3px solid #e0e0e0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.detail-content {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
  padding-left: 24px;
}

.total-box {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  padding: 14px 16px;
  border: 2px solid #bae6fd;
}
</style>
