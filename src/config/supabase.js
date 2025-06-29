import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please create a .env file with:')
  console.error('VITE_SUPABASE_URL=your_supabase_project_url')
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  
  // For development, you can use placeholder values
  // Remove this in production
  if (import.meta.env.DEV) {
    console.warn('Using placeholder Supabase client for development')
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database schema constants
export const TABLES = {
  USERS: 'users',
  COURTS: 'courts',
  BOOKINGS: 'bookings',
  NOTIFICATIONS: 'notifications'
}

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

export const COURT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  MAINTENANCE: 'Maintenance'
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} 