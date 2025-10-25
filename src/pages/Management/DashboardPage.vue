<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">Dashboard</div>
        <div class="text-subtitle2 text-grey-7">Visão geral das operações - {{ currentDate }}</div>
      </div>
      <div class="col-auto">
        <q-btn outline color="primary" icon="refresh" label="Atualizar" @click="refreshData" />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-grey-7 text-caption">Pedidos do Dia</div>
                <div class="text-h4 text-weight-bold q-mt-sm">{{ summary.ordersToday }}</div>
                <div class="text-caption text-positive q-mt-xs">
                  <q-icon name="trending_up" size="14px" />
                  +{{ summary.ordersGrowth }}% vs ontem
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="shopping_cart" size="48px" color="primary" class="icon-bg primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-grey-7 text-caption">Faturamento Diário</div>
                <div class="text-h4 text-weight-bold q-mt-sm">
                  {{ formatCurrency(summary.revenueToday) }}
                </div>
                <div class="text-caption text-positive q-mt-xs">
                  <q-icon name="trending_up" size="14px" />
                  +{{ summary.revenueGrowth }}% vs ontem
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="payments" size="48px" color="positive" class="icon-bg positive" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-grey-7 text-caption">Ticket Médio</div>
                <div class="text-h4 text-weight-bold q-mt-sm">
                  {{ formatCurrency(summary.averageTicket) }}
                </div>
                <div class="text-caption" :class="getTicketChangeClass(summary.ticketChange)">
                  <q-icon :name="getTicketChangeIcon(summary.ticketChange)" size="14px" />
                  {{ summary.ticketChange > 0 ? '+' : '' }}{{ summary.ticketChange }}% vs ontem
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="local_atm" size="48px" color="warning" class="icon-bg warning" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-grey-7 text-caption">Taxa de Aprovação</div>
                <div class="text-h4 text-weight-bold q-mt-sm">{{ summary.approvalRate }}%</div>
                <div class="text-caption text-positive q-mt-xs">
                  <q-icon name="check_circle" size="14px" />
                  {{ summary.approvedOrders }} de {{ summary.ordersToday }} pedidos
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="verified" size="48px" color="info" class="icon-bg info" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-medium">Pedidos dos Últimos 7 Dias</div>
            <div class="text-caption text-grey-7">Comparativo de volume de pedidos</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-medium">🍔 Itens Mais Vendidos</div>
            <div class="text-caption text-grey-7">Top 5 produtos do dia</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(item, index) in topItems" :key="index" class="q-px-md">
              <q-item-section avatar>
                <q-avatar :color="getRankColor(index)" text-color="white" size="32px">
                  {{ index + 1 }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
                <q-item-label caption>{{ item.quantity }} vendidos</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold text-positive">
                  {{ formatCurrency(item.revenue) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6 text-weight-medium">Últimos Pedidos Recebidos</div>
                <div class="text-caption text-grey-7">Acompanhe os pedidos em tempo real</div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  color="primary"
                  label="Ver Todos"
                  icon-right="arrow_forward"
                  size="sm"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-table
              :rows="recentOrders"
              :columns="columns"
              row-key="id"
              flat
              :pagination="{ rowsPerPage: 5 }"
              hide-pagination
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
                  />
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
                  <q-btn flat round dense color="primary" icon="visibility" size="sm">
                    <q-tooltip>Ver Detalhes</q-tooltip>
                  </q-btn>
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
import { ref, computed } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()

const dashboardData = {
  summary: {
    ordersToday: 47,
    ordersGrowth: 12,
    revenueToday: 3845.5,
    revenueGrowth: 18,
    averageTicket: 81.82,
    ticketChange: -5,
    approvalRate: 94,
    approvedOrders: 44,
  },
  topItems: [
    { name: 'X-Bacon Especial', quantity: 23, revenue: 459.0 },
    { name: 'Pizza Calabresa G', quantity: 18, revenue: 828.0 },
    { name: 'Refrigerante 2L', quantity: 31, revenue: 232.5 },
    { name: 'Batata Frita Grande', quantity: 15, revenue: 225.0 },
    { name: 'Combo Família', quantity: 12, revenue: 708.0 },
  ],
  recentOrders: [
    {
      id: '1247',
      customer: 'Maria Silva',
      items: 3,
      total: 89.9,
      status: 'preparing',
      time: '14:32',
    },
    {
      id: '1246',
      customer: 'João Santos',
      items: 5,
      total: 156.5,
      status: 'confirmed',
      time: '14:28',
    },
    {
      id: '1245',
      customer: 'Ana Costa',
      items: 2,
      total: 67.0,
      status: 'delivered',
      time: '14:15',
    },
    {
      id: '1244',
      customer: 'Pedro Oliveira',
      items: 4,
      total: 124.8,
      status: 'delivering',
      time: '14:10',
    },
    {
      id: '1243',
      customer: 'Carla Souza',
      items: 1,
      total: 45.0,
      status: 'delivered',
      time: '13:58',
    },
  ],
}

// Inicialização das variáveis reativas com os dados do JSON
const summary = ref(dashboardData.summary)
const topItems = ref(dashboardData.topItems)
const recentOrders = ref(dashboardData.recentOrders)

const currentDate = computed(() => {
  return date.formatDate(Date.now(), 'DD [de] MMMM [de] YYYY')
})

// Colunas da tabela (Constante) - Não mudou
const columns = [
  { name: 'id', label: 'Pedido', field: 'id', align: 'left' },
  { name: 'customer', label: 'Cliente', field: 'customer', align: 'left' },
  { name: 'items', label: 'Itens', field: 'items', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'time', label: 'Horário', field: 'time', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

/**
 * Formata um valor numérico para o formato de moeda Real (BRL).
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Retorna a cor da badge com base no status do pedido.
 */
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

/**
 * Retorna o label de exibição para o status do pedido.
 */
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

/**
 * Retorna a cor para o ranking dos itens mais vendidos.
 */
const getRankColor = (index) => {
  const colors = ['amber', 'grey-6', 'orange-7', 'blue-grey', 'blue-grey']
  return colors[index] || 'grey'
}

/**
 * Retorna o ícone para a variação do Ticket Médio.
 */
const getTicketChangeIcon = (change) => {
  if (change > 0) return 'trending_up'
  if (change < 0) return 'trending_down'
  return 'trending_flat'
}

/**
 * Retorna a classe de cor para a variação do Ticket Médio.
 */
const getTicketChangeClass = (change) => {
  if (change > 0) return 'text-positive q-mt-xs'
  if (change < 0) return 'text-negative q-mt-xs'
  return 'text-warning q-mt-xs'
}

/**
 * Simula a atualização de dados e exibe uma notificação.
 */
const refreshData = () => {
  $q.notify({
    message: 'Dados atualizados com sucesso! 🚀',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
  })
  // Futuramente, esta função faria uma chamada real à API (por exemplo, usando Axios)
  // para buscar novos dados e atualizar as variáveis 'summary', 'topItems', etc.
}
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.icon-bg {
  opacity: 0.15;
}

/* Usando :deep para estilos de componentes internos, como q-table */
:deep(.q-table__top) {
  padding: 12px 16px;
}

:deep(.q-table tbody td) {
  padding: 12px 16px;
}
</style>
