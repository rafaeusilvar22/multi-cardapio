<template>
  <q-page padding>
    <div class="col-12">
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <div class="col">
              <div class="text-h6 text-weight-medium">Últimos Pedidos Recebidos</div>
              <div class="text-caption text-grey-7">Acompanhe os pedidos em tempo real</div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-table
            flat
            row-key="id"
            :rows="recentOrders"
            :columns="columns"
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <span class="text-weight-medium">#{{ props.value }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-customer="props">
              <q-td :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
                    {{ props.value.charAt(0) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium">{{ props.value }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-items="props">
              <q-td :props="props">
                <q-badge color="grey-4" text-color="dark" :label="props.value + ' itens'" />
              </q-td>
            </template>

            <template v-slot:body-cell-order_type="props">
              <q-td :props="props">
                <q-badge
                  color="grey-4"
                  text-color="dark"
                  :label="props.value"
                  class="text-capitalize"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-total="props">
              <q-td :props="props">
                <span class="text-weight-bold text-positive">
                  {{ formatCurrency(props.value) }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="getStatusColor(props.value)"
                  :label="getStatusLabel(props.value)"
                  class="cursor-pointer"
                  style="padding: 6px 12px"
                >
                  <q-menu>
                    <q-list style="min-width: 180px" dense>
                      <q-item-label header class="text-weight-medium">
                        Alterar Status
                      </q-item-label>
                      <q-separator />

                      <q-item
                        v-for="status in availableStatuses"
                        :key="status.value"
                        clickable
                        v-close-popup
                        @click="handleChangeStatus(props.row, status.value)"
                        :active="props.value === status.value"
                        active-class="bg-grey-2"
                      >
                        <q-item-section avatar>
                          <q-icon :name="status.icon" :color="status.color" size="20px" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ status.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side v-if="props.value === status.value">
                          <q-icon name="check" color="primary" size="18px" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>

                  <q-tooltip>Clique para alterar o status</q-tooltip>
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-time="props">
              <q-td :props="props">
                <div class="text-grey-7">
                  <q-icon name="schedule" size="16px" />
                  {{ props.value }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="visibility"
                  size="sm"
                  @click="handleViewDetails(props.row)"
                >
                  <q-tooltip>Ver Detalhes</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <view-order-details v-model="isShowDetailDialog" :order="orderDetail" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { formatCurrency } from 'src/utils/globalFunctions'
import { useQuasar } from 'quasar'
import ViewOrderDetails from 'components/dialog/ViewOrderDetails.vue'

defineOptions({
  name: 'OrdersPage',
})

const $q = useQuasar()

const columns = [
  { name: 'customer', label: 'Cliente', field: 'customer', align: 'left' },
  { name: 'id', label: 'Pedido', field: 'id', align: 'left' },
  { name: 'time', label: 'Horário', field: 'time', align: 'center' },
  { name: 'order_type', label: 'Tipo', field: 'order_type', align: 'center' },
  { name: 'items', label: 'Itens', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const availableStatuses = [
  {
    value: 'confirmed',
    label: 'Confirmado',
    icon: 'check_circle',
    color: 'info',
  },
  {
    value: 'preparing',
    label: 'Preparando',
    icon: 'restaurant',
    color: 'warning',
  },
  {
    value: 'delivering',
    label: 'Em Entrega',
    icon: 'local_shipping',
    color: 'orange',
  },
  {
    value: 'delivered',
    label: 'Entregue',
    icon: 'done_all',
    color: 'positive',
  },
  {
    value: 'cancelled',
    label: 'Cancelado',
    icon: 'cancel',
    color: 'negative',
  },
]

const recentOrders = ref([
  {
    id: '1247',
    customer: 'Maria Silva',
    items: 3,
    total: 89.9,
    order_type: 'delivery',
    address: 'Rua das Palmeiras, 120 - Centro',
    description: '1x Hambúrguer Clássico, 1x Batata Média, 1x Suco de Laranja',
    notes: 'Sem cebola no hambúrguer',
    payment_method: 'Pix',
    status: 'preparing',
    time: '14:32',
    elapsed_time: '10 min',
  },
  {
    id: '1246',
    customer: 'João Santos',
    items: 5,
    total: 156.5,
    order_type: 'pickup',
    address: 'Retirada no local',
    description: '2x Pizza Calabresa, 1x Pizza Quatro Queijos, 2x Refrigerante Lata',
    notes: 'Cortar as pizzas em 8 pedaços',
    payment_method: 'Cartão de crédito',
    status: 'confirmed',
    time: '14:28',
    elapsed_time: '14 min',
  },
  {
    id: '1245',
    customer: 'Ana Costa',
    items: 2,
    total: 67.0,
    order_type: 'delivery',
    address: 'Av. Brasil, 485 - Bairro Vila Nova',
    description: '1x Strogonoff de Frango, 1x Refrigerante Lata',
    notes: 'Entregar no portão lateral',
    payment_method: 'Dinheiro (troco para R$100)',
    status: 'delivered',
    time: '14:15',
    elapsed_time: '27 min',
  },
  {
    id: '1244',
    customer: 'Pedro Oliveira',
    items: 4,
    total: 124.8,
    order_type: 'delivery',
    address: 'Rua das Hortênsias, 78 - Bairro Itoupava',
    description: '2x X-Bacon, 1x Batata Grande, 1x Suco de Maracujá',
    notes: 'Adicionar maionese extra',
    payment_method: 'Cartão de débito',
    status: 'delivering',
    time: '14:10',
    elapsed_time: '32 min',
  },
  {
    id: '1243',
    customer: 'Carla Souza',
    items: 1,
    total: 45.0,
    order_type: 'pickup',
    address: 'Retirada no local',
    description: '1x Salada Caesar com Frango',
    notes: 'Molho à parte',
    payment_method: 'Pix',
    status: 'delivered',
    time: '13:58',
    elapsed_time: '44 min',
  },
])

const isShowDetailDialog = ref(false)
const orderDetail = ref([])

const getStatusColor = (status) => {
  const colors = {
    confirmed: 'info',
    preparing: 'warning',
    delivering: 'orange',
    delivered: 'positive',
    cancelled: 'negative',
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    delivering: 'Em Entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

const handleViewDetails = (order) => {
  orderDetail.value = order
  isShowDetailDialog.value = true
  console.log('View details for order', order)
}

const handleChangeStatus = (order, newStatus) => {
  const oldStatus = order.status
  order.status = newStatus

  const statusInfo = availableStatuses.find((s) => s.value === newStatus)

  $q.notify({
    message: `Pedido #${order.id} alterado para "${statusInfo.label}"`,
    color: statusInfo.color,
    icon: statusInfo.icon,
    position: 'top-right',
    timeout: 2000,
    actions: [
      {
        label: 'Desfazer',
        color: 'white',
        handler: () => {
          order.status = oldStatus
          $q.notify({
            message: 'Status revertido',
            color: 'grey-7',
            icon: 'undo',
            position: 'top-right',
            timeout: 1500,
          })
        },
      },
    ],
  })

  console.log(`Order #${order.id} status changed from ${oldStatus} to ${newStatus}`)
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
  overflow: hidden;
}
</style>
