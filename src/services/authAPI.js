import { supabase, TABLES, USER_STATUS } from '../config/supabase';

export const authAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get inactive users (admin only)
  getInactiveUsers: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('status', USER_STATUS.INACTIVE)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Approve user (admin only)
  approveUser: async (userId) => {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .update({ status: USER_STATUS.ACTIVE })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Reject user (admin only)
  rejectUser: async (userId) => {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}; 