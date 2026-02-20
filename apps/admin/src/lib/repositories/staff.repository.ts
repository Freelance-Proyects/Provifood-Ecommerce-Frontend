import { httpClient } from '../http/client'

export interface StaffUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface CreateStaffUserPayload {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'admin' | 'operator'
}

export interface UpdateStaffUserPayload {
  email?: string
  password?: string
  first_name?: string
  last_name?: string
  role?: 'admin' | 'operator'
  is_active?: boolean
}

const BASE = '/users/staff'
/** Si el backend no responde en 15s, mostrar error y permitir Reintentar */
const LIST_TIMEOUT_MS = 15_000

export const staffRepository = {
  async list(): Promise<StaffUser[]> {
    const { data } = await httpClient.get<StaffUser[]>(BASE, { timeout: LIST_TIMEOUT_MS })
    return data
  },

  async getById(id: string): Promise<StaffUser> {
    const { data } = await httpClient.get<StaffUser>(`${BASE}/${id}`)
    return data
  },

  async create(payload: CreateStaffUserPayload): Promise<StaffUser> {
    const { data } = await httpClient.post<StaffUser>(BASE, payload)
    return data
  },

  async update(id: string, payload: UpdateStaffUserPayload): Promise<StaffUser> {
    const { data } = await httpClient.patch<StaffUser>(`${BASE}/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${BASE}/${id}`)
  },
}
