import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue')
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('../views/Products.vue')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.initFromStorage()

  const isPublic = to.meta.public === true
  const canAccess = authStore.canAccessDashboard

  // Si ya está logueado (admin u operator) y va al login, ir al dashboard
  if (isPublic && canAccess) {
    return next('/')
  }
  // Cualquier ruta que no sea pública exige login; si no hay sesión válida, redirigir al login
  if (!isPublic && !canAccess) {
    return next({ name: 'Login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined })
  }
  // Operator solo puede ver productos: redirigir el resto a /products
  if (authStore.isOperator && (to.path === '/' || to.path === '/orders' || to.path === '/users')) {
    return next('/products')
  }
  next()
})

export default router
