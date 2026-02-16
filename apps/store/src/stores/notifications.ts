import { atom } from 'nanostores'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

export const $notifications = atom<Notification[]>([])

let notificationId = 0

export function showNotification(
  type: NotificationType,
  title: string,
  message?: string,
  duration: number = 4000
): void {
  const id = `notification-${++notificationId}`

  const notification: Notification = {
    id,
    type,
    title,
    message,
    duration,
  }

  // Agregar notificación
  $notifications.set([...$notifications.get(), notification])

  // Auto-remover después del duration
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

export function removeNotification(id: string): void {
  $notifications.set($notifications.get().filter(n => n.id !== id))
}

// Helpers para tipos específicos
export function showSuccess(title: string, message?: string, duration?: number): void {
  showNotification('success', title, message, duration)
}

export function showError(title: string, message?: string, duration?: number): void {
  showNotification('error', title, message, duration)
}

export function showWarning(title: string, message?: string, duration?: number): void {
  showNotification('warning', title, message, duration)
}

export function showInfo(title: string, message?: string, duration?: number): void {
  showNotification('info', title, message, duration)
}
