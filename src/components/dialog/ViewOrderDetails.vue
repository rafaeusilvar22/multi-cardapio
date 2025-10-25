<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="order-details-card" style="max-width: 550px; width: 100%">
      <!-- Cabeçalho -->
      <q-card-section class="bg-primary text-white q-px-lg">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h5 text-weight-bold">Pedido #{{ order.id }}</div>
            <div class="text-subtitle2 text-white" style="opacity: 0.9">
              {{ order.customer }}
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
              <div class="info-subtitle">{{ order.elapsed_time }}</div>
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

          <!-- Tipo de Pedido -->
          <div class="info-item full-width">
            <div class="info-icon-wrapper bg-purple-1">
              <q-icon
                :name="order.order_type === 'delivery' ? 'delivery_dining' : 'storefront'"
                size="24px"
                color="purple"
              />
            </div>
            <div class="info-content">
              <div class="info-label">Tipo de Pedido</div>
              <div class="info-value">
                {{ order.order_type === 'delivery' ? 'Entrega' : 'Retirada no local' }}
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div v-if="order.address" class="info-item full-width">
            <div class="info-icon-wrapper bg-red-1">
              <q-icon name="place" size="24px" color="red" />
            </div>
            <div class="info-content">
              <div class="info-label">Endereço</div>
              <div class="info-value">{{ order.address }}</div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Detalhes do Pedido -->
      <q-card-section class="q-pa-md q-pt-none">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Detalhes</div>

        <!-- Itens do Pedido -->
        <div class="detail-box q-mb-sm">
          <div class="detail-header">
            <q-icon name="list_alt" size="18px" color="primary" />
            <span class="text-weight-medium">Itens do Pedido</span>
          </div>
          <div class="detail-content">{{ order.description }}</div>
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
              R$ {{ order.total.toFixed(2) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
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

const getStatusColor = (status) => {
  switch (status) {
    case 'preparing':
      return 'warning'
    case 'confirmed':
      return 'info'
    case 'delivering':
      return 'orange'
    case 'delivered':
      return 'positive'
    default:
      return 'grey'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'preparing':
      return 'Preparando'
    case 'confirmed':
      return 'Confirmado'
    case 'delivering':
      return 'Em Entrega'
    case 'delivered':
      return 'Entregue'
    default:
      return 'Desconhecido'
  }
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

.info-subtitle {
  font-size: 0.75rem;
  color: #999;
  font-weight: 400;
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
