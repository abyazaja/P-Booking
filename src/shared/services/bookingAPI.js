import { supabase, TABLES, BOOKING_STATUS } from '../constants/supabase';

export const bookingAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking with data:', bookingData);
      
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .insert([{
          ...bookingData,
          status: BOOKING_STATUS.PENDING
        }])
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        throw error;
      }
      
      console.log('Booking created successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in createBooking:', error);
      return { data: null, error };
    }
  },

  // Get all bookings (admin)
  getAllBookings: async () => {
    try {
      console.log('[BookingAPI] Fetching all bookings for admin...');
      
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          id,
          user_id,
          court_id,
          date,
          start_time,
          end_time,
          notes,
          status,
          created_at,
          updated_at,
          users:user_id (
            id,
            name,
            email,
            role,
            status
          ),
          courts:court_id (
            id,
            name,
            location,
            type,
            capacity,
            status,
            image,
            price
          )
        `)
        .order('created_at', { ascending: false });

      console.log('[BookingAPI] Raw response:', { data, error });
      
      if (error) {
        console.error('[BookingAPI] Error fetching bookings:', error);
        throw error;
      }
      
      // Log sample booking to check user data
      if (data && data.length > 0) {
        console.log('[BookingAPI] Sample booking data:', {
          id: data[0].id,
          user_id: data[0].user_id,
          user_name: data[0].users?.name,
          court_name: data[0].courts?.name,
          status: data[0].status
        });
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('[BookingAPI] Exception in getAllBookings:', error);
      return { data: null, error };
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          *,
          courts:court_id (name, location, image)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          *,
          users:user_id (name, email),
          courts:court_id (name, location, image)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update booking status (admin)
  updateBookingStatus: async (bookingId, status) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Cancel booking (user)
  cancelBooking: async (bookingId, userId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .update({ status: BOOKING_STATUS.CANCELLED })
        .eq('id', bookingId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Check court availability
  checkAvailability: async (courtId, date, startTime, endTime) => {
    try {
      console.log('Checking availability with:', { courtId, date, startTime, endTime });
      
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select('*')
        .eq('court_id', courtId)
        .eq('date', date)
        .in('status', [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED])
        .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

      if (error) {
        console.error('Availability check error:', error);
        throw error;
      }
      
      console.log('Availability check result:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in checkAvailability:', error);
      return { data: null, error };
    }
  },

  // Get pending bookings (admin)
  getPendingBookings: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select(`
          *,
          users:user_id (name, email),
          courts:court_id (name, location)
        `)
        .eq('status', BOOKING_STATUS.PENDING)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}; 