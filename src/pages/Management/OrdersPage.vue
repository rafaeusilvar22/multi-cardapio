<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Pedidos</div>
        <div class="rs-page-subtitle">Acompanhe e gerencie os pedidos em tempo real</div>
      </div>
    </div>

    <q-card class="rs-data-table">
      <!-- Filtros -->
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="filters.customer"
              outlined
              dense
              placeholder="Buscar cliente (nome ou telefone)..."
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.status"
              outlined
              dense
              placeholder="Status"
              :options="statusFilterOptions"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="flag" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.origin"
              outlined
              dense
              placeholder="Origem"
              :options="originOptions"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="storefront" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-table
          flat
          row-key="uuid"
          :rows="recentOrders"
          :columns="columns"
          v-model:pagination="pagination"
          :loading="loading"
          :rows-per-page-options="[10, 20, 50]"
          :grid="$q.screen.lt.md"
          @request="onTableRequest"
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <span class="text-weight-bold">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-customer="props">
            <q-td :props="props">
              <template v-if="props.value">
                <div class="row items-center no-wrap q-gutter-sm">
                  <q-avatar size="32px" color="primary" text-color="white" class="rs-customer-avatar">
                    {{ props.value.name?.[0]?.toUpperCase() || '?' }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-medium">{{ props.value.name }}</div>
                    <div class="text-caption text-grey-6">
                      <q-icon name="phone" size="12px" />
                      {{ props.value.phone }}
                    </div>
                  </div>
                </div>
              </template>
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>

          <template v-slot:body-cell-order_type="props">
            <q-td :props="props">
              <div class="rs-type-badge" :class="`rs-type-badge--${props.value.type}`">
                <q-icon
                  :name="
                    props.value.type === 'table'
                      ? 'table_restaurant'
                      : props.value.type === 'pickup'
                        ? 'store'
                        : 'delivery_dining'
                  "
                  size="14px"
                />
                {{
                  props.value.type === 'table'
                    ? `Mesa ${props.value.table_number}`
                    : props.value.type === 'pickup'
                      ? 'Retirada'
                      : 'Delivery'
                }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-items="props">
            <q-td :props="props">
              <span class="text-weight-medium">{{ props.value }}</span>
              <span class="text-caption text-grey-6"> itens</span>
            </q-td>
          </template>

          <template v-slot:body-cell-origin="props">
            <q-td :props="props">
              <span class="text-caption text-grey-7">{{ getOriginLabel(props.value) }}</span>
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
              <div class="rs-status-chip" :class="`rs-status-chip--${props.value}`">
                <q-icon :name="getStatusIcon(props.value)" size="13px" />
                {{ getStatusLabel(props.value) }}

                <q-menu>
                  <q-list style="min-width: 180px" dense>
                    <q-item-label header class="text-weight-medium">Alterar Status</q-item-label>
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
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-time="props">
            <q-td :props="props">
              <div class="text-grey-7 text-caption">
                <q-icon name="schedule" size="14px" class="q-mr-xs" />{{ props.value }}
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
              <q-btn
                flat
                round
                dense
                color="teal"
                icon="chat"
                size="sm"
                @click="handleOpenChat(props.row)"
              >
                <q-badge
                  v-if="unreadMessageOrders.has(props.row.uuid)"
                  color="negative"
                  floating
                  rounded
                />
                <q-tooltip>Chat com cliente</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-12">
              <q-card flat bordered>
                <q-card-section class="q-py-sm q-px-md">
                  <div class="row items-center justify-between no-wrap q-mb-xs">
                    <div class="row items-center q-gutter-xs">
                      <span class="text-weight-bold">#{{ props.row.id }}</span>
                      <span class="text-caption text-grey-6">· {{ props.row.time }}</span>
                    </div>
                    <div class="rs-status-chip" :class="`rs-status-chip--${props.row.status}`" style="font-size:11px">
                      <q-icon :name="getStatusIcon(props.row.status)" size="12px" />
                      {{ getStatusLabel(props.row.status) }}
                      <q-menu>
                        <q-list style="min-width: 180px" dense>
                          <q-item-label header class="text-weight-medium">Alterar Status</q-item-label>
                          <q-separator />
                          <q-item
                            v-for="status in availableStatuses"
                            :key="status.value"
                            clickable
                            v-close-popup
                            @click="handleChangeStatus(props.row, status.value)"
                          >
                            <q-item-section avatar>
                              <q-icon :name="status.icon" :color="status.color" size="20px" />
                            </q-item-section>
                            <q-item-section>{{ status.label }}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </div>
                  </div>

                  <div class="row items-center justify-between">
                    <div>
                      <div v-if="props.row.customer" class="text-weight-medium">{{ props.row.customer.name }}</div>
                      <div v-if="props.row.customer" class="text-caption text-grey-6">{{ props.row.customer.phone }}</div>
                      <div v-else class="text-grey-5 text-caption">Sem cliente</div>
                    </div>
                    <div class="text-right">
                      <div class="text-weight-bold text-positive">{{ formatCurrency(props.row.total) }}</div>
                      <div class="text-caption text-grey-6">{{ props.row.items }} itens</div>
                    </div>
                  </div>

                  <q-separator class="q-my-sm" />

                  <div class="row items-center justify-between">
                    <div class="rs-type-badge" :class="`rs-type-badge--${props.row.order_type?.type}`" style="font-size:11px">
                      <q-icon
                        :name="props.row.order_type?.type === 'table' ? 'table_restaurant' : props.row.order_type?.type === 'pickup' ? 'store' : 'delivery_dining'"
                        size="12px"
                      />
                      {{
                        props.row.order_type?.type === 'table'
                          ? `Mesa ${props.row.order_type.table_number}`
                          : props.row.order_type?.type === 'pickup'
                            ? 'Retirada'
                            : 'Delivery'
                      }}
                    </div>
                    <div class="row q-gutter-xs">
                      <q-btn flat round dense color="primary" icon="visibility" size="sm" @click="handleViewDetails(props.row)">
                        <q-tooltip>Ver Detalhes</q-tooltip>
                      </q-btn>
                      <q-btn flat round dense color="teal" icon="chat" size="sm" @click="handleOpenChat(props.row)">
                        <q-badge v-if="unreadMessageOrders.has(props.row.uuid)" color="negative" floating rounded />
                        <q-tooltip>Chat</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <view-order-details v-model="isShowDetailDialog" :order="orderDetail" />
    <order-chat-dialog v-model="isShowChatDialog" :order="orderChat" />
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { formatCurrency, formatTime } from 'src/utils/globalFunctions'
import { useQuasar } from 'quasar'
import ViewOrderDetails from 'components/dialog/ViewOrderDetails.vue'
import OrderChatDialog from 'components/dialog/OrderChatDialog.vue'
import { OrderService } from 'src/services/OrderService'
import { useOrderPolling } from 'src/composables/useOrderPolling'

defineOptions({
  name: 'OrdersPage',
})

const $q = useQuasar()

const columns = [
  { name: 'id', label: 'Pedido', field: 'id', align: 'left' },
  { name: 'customer', label: 'Cliente', field: 'customer', align: 'left' },
  { name: 'order_type', label: 'Tipo', field: 'order_type', align: 'center' },
  { name: 'time', label: 'Horário', field: 'time', align: 'center' },
  { name: 'origin', label: 'Origem', field: 'origin', align: 'center' },
  { name: 'items', label: 'Itens', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const availableStatuses = [
  { value: 'pending', label: 'Pendente', icon: 'hourglass_empty', color: 'grey' },
  { value: 'confirmed', label: 'Confirmado', icon: 'check_circle', color: 'info' },
  { value: 'preparing', label: 'Preparando', icon: 'restaurant', color: 'warning' },
  { value: 'ready', label: 'Pronto', icon: 'done', color: 'teal' },
  { value: 'delivering', label: 'Em Entrega', icon: 'local_shipping', color: 'orange' },
  { value: 'delivered', label: 'Entregue', icon: 'done_all', color: 'positive' },
  { value: 'cancelled', label: 'Cancelado', icon: 'cancel', color: 'negative' },
]

const statusFilterOptions = availableStatuses.map(({ value, label }) => ({ value, label }))

const originOptions = [
  { label: 'Cardápio', value: 'menu' },
  { label: 'Administrativo', value: 'admin' },
]

const { clearNewOrders, lastPolledAt, unreadMessageOrders, markOrderRead } = useOrderPolling()

const recentOrders = ref([])
const loading = ref(false)
const isShowDetailDialog = ref(false)
const orderDetail = ref({})
const isShowChatDialog = ref(false)
const orderChat = ref({})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

const filters = ref({
  customer: '',
  status: null,
  origin: null,
})

const mapApiOrder = (order) => {
  const time = formatTime(order.created_at)
  return {
    uuid: order.uuid,
    id: order.id,
    customer: order.customer
      ? { name: order.customer.name, phone: order.customer.phone, email: order.customer.email }
      : null,
    order_type: {
      type: order.table_number ? 'table' : (order.delivery_type || 'delivery'),
      table_number: order.table_number || null,
      delivery_address: order.delivery_address || null,
      delivery_latitude: order.delivery_latitude || null,
      delivery_longitude: order.delivery_longitude || null,
    },
    items: order.items?.length || 0,
    total: parseFloat(order.total_amount) || 0,
    origin: order.origin || '',
    notes: order.notes || '',
    payment_method: order.payment_method || '',
    status: order.status || 'pending',
    time,
    items_list: order.items || [],
  }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
    }
    if (filters.value.customer) params.customer = filters.value.customer
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.origin) params.origin = filters.value.origin

    const resp = await OrderService.getAll(params)
    const data = resp?.data || resp || {}
    recentOrders.value = (data.orders || []).map(mapApiOrder)
    pagination.value.rowsNumber = data.total || 0
  } catch {
    $q.notify({ message: 'Erro ao carregar pedidos', color: 'negative', icon: 'error', position: 'top-right' })
  } finally {
    loading.value = false
  }
}

const onTableRequest = async ({ pagination: { page, rowsPerPage } }) => {
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  await fetchOrders()
}

let customerTimeout = null
watch(
  () => filters.value.customer,
  () => {
    clearTimeout(customerTimeout)
    customerTimeout = setTimeout(() => {
      pagination.value.page = 1
      fetchOrders()
    }, 400)
  },
)

watch(
  () => [filters.value.status, filters.value.origin],
  () => {
    pagination.value.page = 1
    fetchOrders()
  },
)

// Refresh the current filtered view whenever the background poll fires
watch(lastPolledAt, () => { fetchOrders() })

onMounted(() => {
  clearNewOrders()
  fetchOrders()
})

const getOriginLabel = (origin) => {
  const labels = { menu: 'Cardápio', admin: 'Administrativo' }
  return labels[origin] || origin
}

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

const getStatusIcon = (status) => {
  return availableStatuses.find((s) => s.value === status)?.icon || 'circle'
}

const handleViewDetails = (order) => {
  orderDetail.value = order
  isShowDetailDialog.value = true
}

const handleOpenChat = (order) => {
  orderChat.value = order
  isShowChatDialog.value = true
  markOrderRead(order.uuid)
}

const handleChangeStatus = async (order, newStatus) => {
  const oldStatus = order.status
  order.status = newStatus

  const statusInfo = availableStatuses.find((s) => s.value === newStatus)

  try {
    await OrderService.updateStatus(order.uuid, newStatus)
    $q.notify({
      message: `Pedido #${order.id} alterado para "${statusInfo.label}"`,
      color: getStatusColor(newStatus),
      icon: statusInfo.icon,
      position: 'top-right',
      timeout: 2000,
      actions: [
        {
          label: 'Desfazer',
          color: 'white',
          handler: async () => {
            order.status = oldStatus
            try {
              await OrderService.updateStatus(order.uuid, oldStatus)
            } catch {
              order.status = newStatus
            }
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
  } catch {
    order.status = oldStatus
    $q.notify({
      message: 'Erro ao atualizar status do pedido',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
  }
}
</script>

<style lang="scss" scoped>
.rs-customer-avatar {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
