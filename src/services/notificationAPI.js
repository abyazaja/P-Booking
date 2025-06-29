import { supabase, TABLES } from '../config/supabase';

export const notificationAPI = {
  // Get user notifications
  getUserNotifications: async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create notification
  createNotification: async (notificationData) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    try {
      const { count, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (error) {
      return { count: 0, error };
    }
  },

  // Delete notification
  deleteNotification: async (notificationId, userId) => {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Create booking notification
  createBookingNotification: async (userId, bookingId, message, type = 'info') => {
    try {
      const notificationData = {
        user_id: userId,
        message,
        type,
        read: false,
        booking_id: bookingId
      };

      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}; 