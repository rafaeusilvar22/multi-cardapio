const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('src/pages/Management/DashboardPage.vue') },
      { path: 'pedidos', name: 'pedidos', component: () => import('src/pages/Management/OrdersPage.vue') },
      { path: 'produtos', name: 'produtos', component: () => import('src/pages/Management/ProductsPage.vue') },
      { path: 'produtos/novo', name: 'novo-produto', component: () => import('src/pages/Management/NewProductPage.vue') },
      // { path: 'produtos/:id', name: 'editar-produto', component: () => import('src/pages/Management/EditProductPage.vue') },
      { path: 'categorias', name: 'categorias', component: () => import('src/pages/Management/CategoriesPage.vue') },
      { path: 'categorias/nova', name: 'nova-categoria', component: () => import('src/pages/Management/NewCategoryPage.vue') },
      // { path: 'categorias/:id', name: 'editar-categoria', component: () => import('src/pages/Management/EditCategoryPage.vue') },
      { path: 'configuracoes-estabelecimento', name: 'configuracoes-estabelecimento', component: () => import('src/pages/Management/EstablishmentSettings.vue') },

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
