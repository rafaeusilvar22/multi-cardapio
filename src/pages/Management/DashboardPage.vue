<template>
  <q-page class="q-pa-md">
    <!-- Cabeçalho -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h5 text-weight-bold">Dashboard</div>
        <div class="text-caption text-grey-7">{{ currentDate }}</div>
      </div>
    </div>

    <!-- Cards de resumo -->
    <div class="row items-stretch q-col-gutter-md q-mb-lg">

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--blue" />
          <q-card-section class="q-pa-lg">
            <div class="row items-start no-wrap q-gutter-x-md">
              <div class="summary-icon summary-icon--blue">
                <q-icon name="receipt_long" size="22px" color="white" />
              </div>
              <div class="col">
                <div class="card-label">Pedidos Hoje</div>
                <div class="card-value">
                  <q-skeleton v-if="loading" type="text" width="50px" />
                  <span v-else>{{ data.orders_today }}</span>
                </div>
                <div class="card-sub text-orange-7">
                  <q-icon name="hourglass_empty" size="11px" class="q-mr-xs" />{{ data.pending_orders }} pendentes
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--green" />
          <q-card-section class="q-pa-lg">
            <div class="row items-start no-wrap q-gutter-x-md">
              <div class="summary-icon summary-icon--green">
                <q-icon name="payments" size="22px" color="white" />
              </div>
              <div class="col">
                <div class="card-label">Faturamento Hoje</div>
                <div class="card-value card-value--md">
                  <q-skeleton v-if="loading" type="text" width="80px" />
                  <span v-else>{{ formatCurrency(data.revenue_today) }}</span>
                </div>
                <div class="card-sub">
                  Ticket médio: {{ formatCurrency(data.average_ticket) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--purple" />
          <q-card-section class="q-pa-lg">
            <div class="row items-start no-wrap q-gutter-x-md">
              <div class="summary-icon summary-icon--purple">
                <q-icon name="verified" size="22px" color="white" />
              </div>
              <div class="col">
                <div class="card-label">Taxa de Aprovação</div>
                <div class="card-value">
                  <q-skeleton v-if="loading" type="text" width="50px" />
                  <span v-else>{{ data.approval_rate }}%</span>
                </div>
                <div class="card-sub text-positive">
                  <q-icon name="check_circle" size="11px" class="q-mr-xs" />{{ data.approved_orders }} de {{ data.orders_today }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--amber" />
          <q-card-section class="q-pa-lg">
            <div class="row items-start no-wrap q-gutter-x-md">
              <div class="summary-icon summary-icon--amber">
                <q-icon name="local_atm" size="22px" color="white" />
              </div>
              <div class="col">
                <div class="card-label">Ticket Médio</div>
                <div class="card-value card-value--md">
                  <q-skeleton v-if="loading" type="text" width="80px" />
                  <span v-else>{{ formatCurrency(data.average_ticket) }}</span>
                </div>
                <div class="card-sub">por pedido confirmado</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- Itens mais vendidos + Últimos pedidos -->
    <div class="row items-stretch q-col-gutter-md">

      <!-- Top itens -->
      <div class="col-12 col-md-4">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--blue" />
          <q-card-section class="q-px-lg q-pt-md q-pb-sm">
            <div class="text-subtitle1 text-weight-bold">Itens Mais Vendidos</div>
            <div class="text-caption text-grey-6">Top 5 produtos do dia</div>
          </q-card-section>
          <q-separator />

          <div v-if="loading" class="q-pa-md q-gutter-sm">
            <q-skeleton v-for="i in 5" :key="i" height="40px" class="q-mb-xs" />
          </div>

          <q-list v-else-if="data.top_items?.length" separator>
            <q-item v-for="(item, index) in data.top_items" :key="index" class="q-py-sm">
              <q-item-section avatar>
                <q-avatar :color="rankColor(index)" text-color="white" size="30px" style="font-size: 13px; font-weight: 700">
                  {{ index + 1 }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium ellipsis">{{ item.name }}</q-item-label>
                <q-item-label caption>{{ item.quantity }} un. vendidas</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold text-positive text-caption">
                  {{ formatCurrency(item.revenue) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="flex flex-center column q-py-xl text-grey-5">
            <q-icon name="bar_chart" size="40px" />
            <span class="text-caption q-mt-sm">Nenhum pedido hoje ainda</span>
          </div>
        </q-card>
      </div>

      <!-- Últimos pedidos -->
      <div class="col-12 col-md-8">
        <q-card class="summary-card full-height">
          <div class="card-accent card-accent--green" />
          <q-card-section class="q-px-lg q-pt-md q-pb-sm">
            <div class="row items-center">
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">Últimos Pedidos</div>
                <div class="text-caption text-grey-6">Os 5 pedidos mais recentes</div>
              </div>
              <q-btn flat dense no-caps color="primary" label="Ver todos" icon-right="arrow_forward" :to="{ name: 'pedidos' }" size="sm" />
            </div>
          </q-card-section>
          <q-separator />

          <div v-if="loading" class="q-pa-md q-gutter-sm">
            <q-skeleton v-for="i in 5" :key="i" height="48px" />
          </div>

          <q-card-section v-else-if="!data.recent_orders?.length" class="flex flex-center column q-py-xl text-grey-5">
            <q-icon name="inbox" size="40px" />
            <span class="text-caption q-mt-sm">Nenhum pedido recebido</span>
          </q-card-section>

          <q-card-section v-else class="q-pa-none">
            <q-table
              :rows="data.recent_orders"
              :columns="columns"
              row-key="uuid"
              flat
              :pagination="{ rowsPerPage: 5 }"
              hide-pagination
              hide-bottom
            >
              <template v-slot:body-cell-id="props">
                <q-td :props="props">
                  <span class="text-weight-medium">#{{ props.value }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-customer="props">
                <q-td :props="props">
                  <div v-if="props.value" class="row items-center no-wrap">
                    <q-avatar size="28px" color="primary" text-color="white" class="q-mr-sm" style="font-size: 12px">
                      {{ props.value.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <span class="text-weight-medium ellipsis" style="max-width: 120px">{{ props.value }}</span>
                  </div>
                  <span v-else class="text-grey-5">—</span>
                </q-td>
              </template>

              <template v-slot:body-cell-items="props">
                <q-td :props="props">
                  <q-badge color="grey-3" text-color="dark" :label="props.value + ' itens'" />
                </q-td>
              </template>

              <template v-slot:body-cell-total="props">
                <q-td :props="props">
                  <span class="text-weight-bold text-positive">{{ formatCurrency(props.value) }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="statusColor(props.value)" :label="statusLabel(props.value)" style="padding: 4px 8px" />
                </q-td>
              </template>

              <template v-slot:body-cell-time="props">
                <q-td :props="props">
                  <span class="text-grey-7 text-caption">{{ props.value }}</span>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { date } from 'quasar'
import { useQuasar } from 'quasar'
import { OrderService } from 'src/services/OrderService'
import { formatCurrency, formatTime } from 'src/utils/globalFunctions'
import { useOrderPolling } from 'src/composables/useOrderPolling'

defineOptions({ name: 'DashboardPage' })

const $q = useQuasar()
const loading = ref(false)

const { lastEvent } = useOrderPolling()
watch(lastEvent, () => { load() })

const data = ref({
  orders_today: 0,
  revenue_today: 0,
  average_ticket: 0,
  approval_rate: 0,
  approved_orders: 0,
  pending_orders: 0,
  top_items: [],
  recent_orders: [],
})

const currentDate = computed(() =>
  date.formatDate(Date.now(), 'dddd, DD [de] MMMM [de] YYYY'),
)

const columns = [
  { name: 'id',       label: '#',       field: 'id',                                    align: 'left'   },
  { name: 'customer', label: 'Cliente',  field: (r) => r.customer?.name ?? null,         align: 'left'   },
  { name: 'items',    label: 'Itens',    field: (r) => r.items?.length ?? 0,             align: 'center' },
  { name: 'total',    label: 'Total',    field: (r) => parseFloat(r.total_amount) || 0,  align: 'right'  },
  { name: 'status',   label: 'Status',   field: 'status',                                align: 'center' },
  { name: 'time',     label: 'Horário',  field: (r) => formatTime(r.created_at),         align: 'center' },
]

const load = async () => {
  loading.value = true
  try {
    const resp = await OrderService.getDashboard()
    const d = resp.data ?? resp
    data.value = {
      orders_today: d.orders_today ?? 0,
      revenue_today: d.revenue_today ?? 0,
      average_ticket: d.average_ticket ?? 0,
      approval_rate: d.approval_rate ?? 0,
      approved_orders: d.approved_orders ?? 0,
      pending_orders: d.pending_orders ?? 0,
      top_items: d.top_items ?? [],
      recent_orders: d.recent_orders ?? [],
    }
  } catch {
    $q.notify({ message: 'Erro ao carregar dashboard', color: 'negative', icon: 'error', position: 'top-right' })
  } finally {
    loading.value = false
  }
}

const rankColor = (i) => ['amber-8', 'grey-6', 'orange-7', 'blue-grey-4', 'blue-grey-3'][i] ?? 'grey'

const statusColor = (s) => ({
  pending: 'grey', confirmed: 'info', preparing: 'warning',
  ready: 'teal', delivering: 'orange', delivered: 'positive', cancelled: 'negative',
})[s] ?? 'grey'

const statusLabel = (s) => ({
  pending: 'Pendente', confirmed: 'Confirmado', preparing: 'Preparando',
  ready: 'Pronto', delivering: 'Em Entrega', delivered: 'Entregue', cancelled: 'Cancelado',
})[s] ?? s

onMounted(load)
</script>

<style scoped>
/* ── Summary cards ── */
.summary-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.06) !important;
}

/* top accent bar */
.card-accent {
  height: 3px;
  width: 100%;
}
.card-accent--blue   { background: linear-gradient(90deg, #1976D2, #42A5F5); }
.card-accent--green  { background: linear-gradient(90deg, #2E7D32, #66BB6A); }
.card-accent--purple { background: linear-gradient(90deg, #6A1B9A, #AB47BC); }
.card-accent--amber  { background: linear-gradient(90deg, #E65100, #FFA726); }

/* icon badge */
.summary-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.summary-icon--blue   { background: linear-gradient(135deg, #1976D2, #42A5F5); }
.summary-icon--green  { background: linear-gradient(135deg, #2E7D32, #66BB6A); }
.summary-icon--purple { background: linear-gradient(135deg, #6A1B9A, #AB47BC); }
.summary-icon--amber  { background: linear-gradient(135deg, #E65100, #FFA726); }

/* typography */
.card-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #9e9e9e;
  line-height: 1.2;
  margin-bottom: 4px;
}
.card-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  color: inherit;
}
.card-value--md {
  font-size: 20px;
}
.card-sub {
  font-size: 11.5px;
  color: #9e9e9e;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

/* misc */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
