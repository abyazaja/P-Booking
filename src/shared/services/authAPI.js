import { supabase, TABLES, USER_STATUS } from '../constants/supabase';

export const authAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      console.log('[authAPI] Getting all users...');
      console.log('[authAPI] Using table:', TABLES.USERS);
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[authAPI] Current session:', session?.user?.id);
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*');

      console.log('[authAPI] Supabase response:', { data, error });
      console.log('[authAPI] Data length:', data?.length);
      console.log('[authAPI] Data details:', data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at
      })));

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[authAPI] Error in getAllUsers:', error);
      return { data: null, error };
    }
  },

  // Get inactive users (admin only) - for user management/troubleshooting
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

  // Activate user (admin only) - for re-enabling disabled users
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

  // Delete user (admin only) - for removing problematic users
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