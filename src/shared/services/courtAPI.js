import { supabase, TABLES, COURT_STATUS } from '../constants/supabase';

export const courtAPI = {
  // Get all courts
  getAllCourts: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.COURTS)
        .select(`
          id,
          name,
          location,
          type,
          capacity,
          status,
          image,
          price,
          user_id,
          created_at,
          updated_at
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get active courts
  getActiveCourts: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.COURTS)
        .select(`
          id,
          name,
          location,
          type,
          capacity,
          status,
          image,
          price,
          user_id,
          created_at,
          updated_at
        `)
        .eq('status', COURT_STATUS.ACTIVE)
        .order('name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get by ID
  getCourtById: async (courtId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.COURTS)
        .select('*')
        .eq('id', courtId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create
  createCourt: async (courtData) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.COURTS)
        .insert([courtData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update
  updateCourt: async (courtId, updates) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.COURTS)
        .update(updates)
        .eq('id', courtId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete
  deleteCourt: async (courtId) => {
    try {
      const { error } = await supabase
        .from(TABLES.COURTS)
        .delete()
        .eq('id', courtId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Upload image
  uploadCourtImage: async (file, courtId) => {
    try {
      // Validasi file
      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file format");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${courtId}-${Date.now()}.${fileExt}`;
      const filePath = `courts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('court-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data, error: urlError } = supabase.storage
        .from('court-images')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      return { publicUrl: data.publicUrl, error: null };
    } catch (error) {
      return { publicUrl: null, error };
    }
  }
};
