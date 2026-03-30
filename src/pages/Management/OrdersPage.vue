<template>
  <q-page class="kanban-page">
    <!-- Page Header -->
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Pedidos</div>
        <div class="rs-page-subtitle">Acompanhe e gerencie os pedidos em tempo real</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="kanban-filters q-mb-md">
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
        <div class="col-auto q-ml-auto flex items-center">
          <q-btn
            flat
            round
            dense
            icon="refresh"
            :loading="loading"
            color="grey-7"
            @click="fetchOrders"
          >
            <q-tooltip>Atualizar pedidos</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="kanban-board" v-if="!loading || kanbanColumns.some(c => c.orders.length > 0)">
      <div
        v-for="col in kanbanColumns"
        :key="col.value"
        class="kanban-column"
        :class="`kanban-column--${col.value}`"
      >
        <!-- Column Header -->
        <div class="kanban-column-header">
          <div class="row items-center no-wrap q-gutter-xs">
            <q-icon :name="col.icon" size="16px" />
            <span class="kanban-column-title">{{ col.label }}</span>
          </div>
          <q-badge
            :label="col.orders.length"
            rounded
            class="kanban-column-badge"
          />
        </div>

        <!-- Scrollable body -->
        <div class="kanban-column-body" @scroll="onColumnScroll($event, col)">
        <draggable
          v-model="col.orders"
          :group="{ name: 'orders', put: canDropInColumn(col.value) }"
          item-key="uuid"
          class="kanban-draggable"
          ghost-class="kanban-card--ghost"
          drag-class="kanban-card--dragging"
          animation="200"
          @change="(e) => onColumnChange(e, col.value)"
        >
          <template #item="{ element: order }">
            <div
              class="kanban-card"
              :class="{ 'kanban-card--dark': isDark }"
              :data-order-type="order.order_type?.type"
            >
              <!-- Card header -->
              <div class="kanban-card-header">
                <div class="row items-center no-wrap q-gutter-xs">
                  <span class="kanban-card-id text-weight-bold">#{{ order.id }}</span>
                  <span class="text-caption text-grey-5">· {{ order.time }}</span>
                </div>
                <div class="rs-type-badge" :class="`rs-type-badge--${order.order_type?.type}`">
                  <q-icon
                    :name="
                      order.order_type?.type === 'table'
                        ? 'table_restaurant'
                        : order.order_type?.type === 'pickup'
                          ? 'store'
                          : 'delivery_dining'
                    "
                    size="12px"
                  />
                  {{
                    order.order_type?.type === 'table'
                      ? `Mesa ${order.order_type.table_number}`
                      : order.order_type?.type === 'pickup'
                        ? 'Retirada'
                        : 'Delivery'
                  }}
                </div>
              </div>

              <!-- Status chip clicável -->
              <div class="q-mb-xs">
                <div class="kanban-status-chip" :class="`kanban-status-chip--${order.status}`">
                  <q-icon :name="getStatusIcon(order.status)" size="12px" />
                  {{ getStatusLabel(order.status) }}
                  <q-icon name="arrow_drop_down" size="14px" class="q-ml-xs" />

                  <q-menu>
                    <q-list style="min-width: 180px" dense>
                      <q-item-label header class="text-weight-medium">Alterar Status</q-item-label>
                      <q-separator />
                      <q-item
                        v-for="status in getAllowedStatuses(order.order_type?.type)"
                        :key="status.value"
                        clickable
                        v-close-popup
                        :active="order.status === status.value"
                        active-class="bg-grey-2"
                        @click="handleChangeStatus(order, status.value)"
                      >
                        <q-item-section avatar>
                          <q-icon :name="status.icon" :color="status.color" size="18px" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ status.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side v-if="order.status === status.value">
                          <q-icon name="check" color="primary" size="16px" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>

                  <q-tooltip>Clique para alterar o status</q-tooltip>
                </div>
              </div>

              <!-- Customer info -->
              <div class="kanban-card-customer">
                <template v-if="order.customer">
                  <div class="row items-center q-gutter-xs no-wrap">
                    <q-avatar size="24px" color="primary" text-color="white" style="font-size:10px; font-weight:700; flex-shrink:0">
                      {{ order.customer.name?.[0]?.toUpperCase() || '?' }}
                    </q-avatar>
                    <div>
                      <div class="text-weight-medium" style="font-size:13px; line-height:1.3">{{ order.customer.name }}</div>
                      <div class="text-caption text-grey-5">{{ order.customer.phone }}</div>
                    </div>
                  </div>
                </template>
                <span v-else class="text-caption text-grey-5">Sem cliente</span>
              </div>

              <q-separator class="q-my-xs" />

              <!-- Footer: items, total, actions -->
              <div class="kanban-card-footer">
                <div>
                  <div class="text-weight-bold text-positive" style="font-size:13px">
                    {{ formatCurrency(order.total) }}
                  </div>
                  <div class="text-caption text-grey-5">{{ order.items }} iten{{ order.items !== 1 ? 's' : '' }}</div>
                </div>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense color="primary" icon="visibility" size="xs" @click="handleViewDetails(order)">
                    <q-tooltip>Ver Detalhes</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="teal" icon="chat" size="xs" @click="handleOpenChat(order)">
                    <q-badge v-if="unreadMessageOrders.has(order.uuid)" color="negative" floating rounded />
                    <q-tooltip>Chat com cliente</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <!-- Empty state -->
        <div v-if="col.orders.length === 0 && !col.loadingMore" class="kanban-column-empty">
          <q-icon name="inbox" size="28px" color="grey-4" />
          <div class="text-caption text-grey-4 q-mt-xs">Nenhum pedido</div>
        </div>

        <!-- Loading more indicator -->
        <div v-if="col.loadingMore" class="kanban-load-more">
          <q-spinner color="grey-5" size="20px" />
        </div>

        </div><!-- end kanban-column-body -->
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else class="kanban-board">
      <div v-for="n in 5" :key="n" class="kanban-column">
        <q-skeleton height="40px" class="q-mb-sm" />
        <q-skeleton v-for="i in 3" :key="i" height="110px" class="q-mb-sm" />
      </div>
    </div>

    <view-order-details v-model="isShowDetailDialog" :order="orderDetail" />
    <order-chat-dialog v-model="isShowChatDialog" :order="orderChat" />
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Dark } from 'quasar'
import draggable from 'vuedraggable'
import { formatCurrency, formatTime } from 'src/utils/globalFunctions'
import { useQuasar } from 'quasar'
import ViewOrderDetails from 'components/dialog/ViewOrderDetails.vue'
import OrderChatDialog from 'components/dialog/OrderChatDialog.vue'
import { OrderService } from 'src/services/OrderService'
import { useOrderPolling } from 'src/composables/useOrderPolling'
import useNotify from 'src/composables/showNotify'

defineOptions({ name: 'OrdersPage' })

const $q = useQuasar()
const { notifyError } = useNotify()
const isDark = computed(() => Dark.isActive)

const availableStatuses = [
  { value: 'pending',   label: 'Pendente',        icon: 'hourglass_empty', color: 'grey' },
  { value: 'confirmed', label: 'Confirmado',       icon: 'check_circle',    color: 'info' },
  { value: 'preparing', label: 'Preparando',       icon: 'restaurant',      color: 'warning' },
  { value: 'ready',     label: 'Pronto',           icon: 'done',            color: 'teal' },
  { value: 'delivering',label: 'Em Entrega',       icon: 'local_shipping',  color: 'orange' },
  { value: 'delivered', label: 'Entregue',         icon: 'done_all',        color: 'positive' },
  { value: 'cancelled', label: 'Cancelado',        icon: 'cancel',          color: 'negative' },
]

const originOptions = [
  { label: 'Cardápio', value: 'menu' },
  { label: 'Administrativo', value: 'admin' },
]

// Colunas permitidas por modalidade de pedido
const ALLOWED_STATUSES = {
  delivery: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
  pickup:   ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
  table:    ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
}

const isStatusAllowed = (orderType, status) => {
  const allowed = ALLOWED_STATUSES[orderType] ?? ALLOWED_STATUSES.delivery
  return allowed.includes(status)
}

const getAllowedStatuses = (orderType) =>
  availableStatuses.filter((s) => isStatusAllowed(orderType, s.value))

// put callback: retorna false se o card não pode ser solto nesta coluna
const canDropInColumn = (targetStatus) => (_to, _from, dragEl) => {
  const orderType = dragEl.dataset.orderType
  return isStatusAllowed(orderType, targetStatus)
}

const { clearNewOrders, lastPolledAt, unreadMessageOrders, markOrderRead } = useOrderPolling()

const COLUMN_PAGE_SIZE = 10

// Kanban columns — writable so vuedraggable can mutate them
const kanbanColumns = ref(
  availableStatuses.map((s) => ({
    ...s,
    orders: [],
    page: 1,
    hasMore: false,
    loadingMore: false,
  })),
)

const loading = ref(false)
const isShowDetailDialog = ref(false)
const orderDetail = ref({})
const isShowChatDialog = ref(false)
const orderChat = ref({})

const filters = ref({
  customer: '',
  origin: null,
})

const mapApiOrder = (order) => ({
  uuid: order.uuid,
  id: order.id,
  customer: order.customer
    ? { name: order.customer.name, phone: order.customer.phone, email: order.customer.email }
    : null,
  order_type: {
    type: order.table_number ? 'table' : (order.delivery_type || 'delivery'),
    table_number: order.table_number || null,
  },
  items: order.items?.length || 0,
  total: parseFloat(order.total_amount) || 0,
  origin: order.origin || '',
  notes: order.notes || '',
  payment_method: order.payment_method || '',
  status: order.status || 'pending',
  time: formatTime(order.created_at),
  items_list: order.items || [],
})

// Fetch one column — if append=false resets to page 1
const fetchColumn = async (col, append = false) => {
  if (!append) {
    col.page = 1
  }
  col.loadingMore = true
  try {
    const params = {
      page: col.page,
      limit: COLUMN_PAGE_SIZE,
      status: col.value,
    }
    if (filters.value.customer) params.customer = filters.value.customer
    if (filters.value.origin) params.origin = filters.value.origin

    const resp = await OrderService.getAll(params)
    const data = resp?.data || resp || {}
    const newOrders = (data.orders || []).map(mapApiOrder)

    if (append) {
      col.orders.push(...newOrders)
    } else {
      col.orders = newOrders
    }

    col.hasMore = newOrders.length === COLUMN_PAGE_SIZE
  } catch {
    // silent — global error shown at fetchOrders level
  } finally {
    col.loadingMore = false
  }
}

// Fetch all columns in parallel (initial load or filter change)
const fetchOrders = async () => {
  loading.value = true
  try {
    await Promise.allSettled(kanbanColumns.value.map((col) => fetchColumn(col)))
  } catch {
    notifyError('Erro ao carregar pedidos')
  } finally {
    loading.value = false
  }
}

// Load next page for a single column
const loadMoreColumn = async (col) => {
  col.page += 1
  await fetchColumn(col, true)
}

// Infinite scroll — fires when user scrolls near the bottom of a column
const onColumnScroll = (event, col) => {
  if (!col.hasMore || col.loadingMore) return
  const el = event.target
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
    loadMoreColumn(col)
  }
}

// Move an order card to a specific column.
// If already in the target column (e.g. after drag), only updates the status.
const moveOrderToColumn = (order, targetStatus) => {
  for (const col of kanbanColumns.value) {
    const idx = col.orders.findIndex((o) => o.uuid === order.uuid)
    if (idx !== -1) {
      if (col.value === targetStatus) {
        order.status = targetStatus
        return
      }
      col.orders.splice(idx, 1)
      break
    }
  }
  const targetCol = kanbanColumns.value.find((c) => c.value === targetStatus)
  if (targetCol) {
    order.status = targetStatus
    targetCol.orders.unshift(order)
  }
}

const getStatusLabel = (status) => availableStatuses.find((x) => x.value === status)?.label || status
const getStatusIcon = (status) => availableStatuses.find((x) => x.value === status)?.icon || 'circle'

const handleChangeStatus = async (order, newStatus) => {
  const oldStatus = order.status
  moveOrderToColumn(order, newStatus)

  const statusInfo = availableStatuses.find((s) => s.value === newStatus)

  try {
    await OrderService.updateStatus(order.uuid, newStatus)
    $q.notify({
      message: `Pedido <strong>#${order.id}</strong> movido para <strong>${statusInfo.label}</strong>`,
      html: true,
      position: 'top-right',
      timeout: 3500,
      progress: true,
      classes: 'rs-notify rs-notify--success',
      icon: statusInfo.icon,
      actions: [
        {
          label: 'Desfazer',
          flat: true,
          color: 'grey-7',
          handler: async () => {
            moveOrderToColumn(order, oldStatus)
            try {
              await OrderService.updateStatus(order.uuid, oldStatus)
            } catch {
              moveOrderToColumn(order, newStatus)
            }
            $q.notify({
              message: 'Status revertido',
              html: true,
              position: 'top-right',
              timeout: 2000,
              progress: true,
              classes: 'rs-notify rs-notify--info',
              icon: 'undo',
            })
          },
        },
        { icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' },
      ],
    })
  } catch {
    moveOrderToColumn(order, oldStatus)
    notifyError('Erro ao atualizar status do pedido')
  }
}

// Called by vuedraggable when an item is dropped into a column
const onColumnChange = (event, targetStatus) => {
  if (event.added) {
    handleChangeStatus(event.added.element, targetStatus)
  }
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

let customerTimeout = null
watch(
  () => filters.value.customer,
  () => {
    clearTimeout(customerTimeout)
    customerTimeout = setTimeout(() => fetchOrders(), 400)
  },
)

watch(() => filters.value.origin, () => fetchOrders())

watch(lastPolledAt, () => fetchOrders())

onMounted(() => {
  clearNewOrders()
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.kanban-page {
  background: var(--q-grey-1, #f5f5f5);

  .body--dark & {
    background: #121212;
  }
}

.kanban-filters {
  padding: 0 4px;
}

// ── Board ────────────────────────────────────────────────────────────────────
.kanban-board {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 16px;
  align-items: flex-start;

  // Smooth scrollbar
  scrollbar-width: thin;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
}

// ── Column ───────────────────────────────────────────────────────────────────
.kanban-column {
  width: 270px;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  overflow: hidden;

  .body--dark & {
    background: rgba(255, 255, 255, 0.04);
  }
}

.kanban-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  border-top: 3px solid transparent;
  background: white;

  .body--dark & {
    background: #1e1e1e;
  }
}

.kanban-column-title {
  font-size: 13px;
  font-weight: 600;
}

.kanban-column-badge {
  font-size: 11px;
  font-weight: 700;
}

.kanban-column-body {
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  min-height: 80px;
  padding: 0 8px 8px;

  scrollbar-width: thin;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
}

.kanban-draggable {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  min-height: 40px; // keeps the drop target visible when empty
}

.kanban-load-more {
  display: flex;
  justify-content: center;
  padding: 8px 0 4px;
}

.kanban-column-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  opacity: 0.5;
}

// ── Status column colors ──────────────────────────────────────────────────────
.kanban-column--pending .kanban-column-header {
  border-top-color: #9e9e9e;
  .kanban-column-badge { background: #9e9e9e; }
}
.kanban-column--confirmed .kanban-column-header {
  border-top-color: #1976d2;
  .kanban-column-badge { background: #1976d2; }
}
.kanban-column--preparing .kanban-column-header {
  border-top-color: #f57f17;
  .kanban-column-badge { background: #f57f17; }
}
.kanban-column--ready .kanban-column-header {
  border-top-color: #00796b;
  .kanban-column-badge { background: #00796b; }
}
.kanban-column--delivering .kanban-column-header {
  border-top-color: #e64a19;
  .kanban-column-badge { background: #e64a19; }
}
.kanban-column--delivered .kanban-column-header {
  border-top-color: #388e3c;
  .kanban-column-badge { background: #388e3c; }
}
.kanban-column--cancelled .kanban-column-header {
  border-top-color: #c62828;
  .kanban-column-badge { background: #c62828; }
}

// ── Cards ────────────────────────────────────────────────────────────────────
.kanban-card {
  background: white;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #eeeeee;
  cursor: grab;
  transition: box-shadow 0.15s, transform 0.15s;
  user-select: none;

  &:hover {
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &--dark {
    background: #242424;
    border-color: #333;

    &:hover {
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
    }
  }

  &--ghost {
    opacity: 0.4;
    border: 2px dashed var(--q-primary);
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.06);
  }

  &--dragging {
    cursor: grabbing;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    transform: rotate(1.5deg) scale(1.02);
  }
}

.kanban-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 6px;
}

.kanban-card-id {
  font-size: 13px;
  color: var(--q-primary);
}

.kanban-card-customer {
  margin-bottom: 6px;
}

.kanban-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// ── Status chip (clicável dentro do card) ────────────────────────────────────
.kanban-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s;

  &:hover { opacity: 0.8; }

  &--pending   { background: #f5f5f5;  color: #616161; }
  &--confirmed { background: #e3f2fd;  color: #1565c0; }
  &--preparing { background: #fff8e1;  color: #e65100; }
  &--ready     { background: #e0f2f1;  color: #00695c; }
  &--delivering{ background: #fbe9e7;  color: #bf360c; }
  &--delivered { background: #e8f5e9;  color: #2e7d32; }
  &--cancelled { background: #fce4ec;  color: #b71c1c; }
}

// ── Type badges (reused from original) ───────────────────────────────────────
.rs-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;

  &--table   { background: #e3f2fd; color: #1565c0; }
  &--pickup  { background: #f3e5f5; color: #6a1b9a; }
  &--delivery { background: #e8f5e9; color: #2e7d32; }
}
</style>
