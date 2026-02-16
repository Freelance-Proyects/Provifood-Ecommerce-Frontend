// Type definitions for window global functions
import type { Product } from '@provifood/types'

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

interface Window {
  showConfirmModal: (options: ConfirmOptions) => Promise<boolean>
  closeToast?: (id: string) => void
  showQuickView?: (product: Product) => void
}

// Export to make it a module
export {}
