const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('src/pages/Management/DashboardPage.vue') },
      { path: 'pedidos', name: 'pedidos', component: () => import('src/pages/Management/OrdersPage.vue') },
      { path: 'produtos', name: 'produtos', component: () => import('src/pages/Management/ProductsPage.vue') },
      { path: 'produtos/novo', name: 'novo-produto', component: () => import('src/pages/Management/NewProductPage.vue') },
      { path: 'produtos/:uuid', name: 'editar-produto', component: () => import('src/pages/Management/NewProductPage.vue') },
      { path: 'categorias', name: 'categorias', component: () => import('src/pages/Management/CategoriesPage.vue') },
      { path: 'categorias/nova', name: 'nova-categoria', component: () => import('src/pages/Management/NewCategoryPage.vue') },
      { path: 'categorias/:uuid', name: 'editar-categoria', component: () => import('src/pages/Management/NewCategoryPage.vue') },
      { path: 'configuracoes-estabelecimento', redirect: { name: 'configuracoes-informacoes' } },
      { path: 'configuracoes/informacoes', name: 'configuracoes-informacoes', component: () => import('src/pages/Management/settings/SettingsInfoPage.vue') },
      { path: 'configuracoes/horarios', name: 'configuracoes-horarios', component: () => import('src/pages/Management/settings/SettingsHoursPage.vue') },
      { path: 'configuracoes/aparencia', name: 'configuracoes-aparencia', component: () => import('src/pages/Management/settings/SettingsAppearancePage.vue') },
      { path: 'configuracoes/entrega-pagamento', name: 'configuracoes-entrega-pagamento', component: () => import('src/pages/Management/settings/SettingsDeliveryPage.vue') },
      { path: 'cupons', name: 'cupons', component: () => import('src/pages/Management/CouponsPage.vue') },

      // Super-admin routes
      { path: 'admin/estabelecimentos', name: 'admin-workspaces', component: () => import('src/pages/Admin/WorkspacesPage.vue'), meta: { requiresSuperAdmin: true } },
      { path: 'admin/estabelecimentos/novo', name: 'admin-workspace-create', component: () => import('src/pages/Admin/CreateWorkspacePage.vue'), meta: { requiresSuperAdmin: true } },
      { path: 'admin/estabelecimentos/:uuid', name: 'admin-workspace-detail', component: () => import('src/pages/Admin/WorkspaceDetailPage.vue'), meta: { requiresSuperAdmin: true } },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'criar-conta',
        name: 'criar-conta',
        component: () => import('src/pages/auth/CreateAccountPage.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/auth/LoginPage.vue'),
      },
      {
        path: 'esqueci-minha-senha',
        name: 'forgot-password',
        component: () => import('src/pages/auth/ForgotPasswordPage.vue'),
      },
      {
        path: 'redefinir-senha',
        name: 'reset-password',
        component: () => import('src/pages/auth/ResetPasswordPage.vue'),
      },
    ],
  },

  {
    path: '/:companySlug',
    component: () => import('layouts/MenuLayout.vue'),
    children: [
      { path: '', name: 'menu', component: () => import('src/pages/Menu/MenuPage.vue') },
      { path: 'pedidos/:orderUuid', name: 'track-order', component: () => import('src/pages/Menu/TrackOrderPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
