// Debug script for auth issues
// Run this in browser console to debug auth state

console.log('=== P-Booking Auth Debug ===');

// Check Supabase session
async function checkAuthState() {
  try {
    // Import supabase if available
    const supabase = window.supabase || (await import('./src/shared/constants/supabase.js')).supabase;
    
    console.log('1. Checking Supabase session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      return;
    }
    
    console.log('Session exists:', !!session);
    console.log('User ID:', session?.user?.id);
    console.log('User email:', session?.user?.email);
    
    if (session?.user) {
      console.log('2. Checking user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Profile error:', profileError);
        console.log('This is likely the cause of the loading issue!');
        
        if (profileError.code === '42501' || 
            profileError.message?.toLowerCase().includes('permission') ||
            profileError.message?.toLowerCase().includes('rls')) {
          console.log('❌ RLS Policy Issue: Run the database-setup.sql script!');
        }
      } else {
        console.log('✅ Profile loaded:', profile);
      }
    }
    
    console.log('3. Local Storage check...');
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        console.log(`LocalStorage[${key}]:`, localStorage.getItem(key));
      }
    });
    
  } catch (err) {
    console.error('Debug error:', err);
  }
}

// Clear all auth data
function clearAuthData() {
  console.log('Clearing all auth data...');
  
  // Clear localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      localStorage.removeItem(key);
      console.log('Removed:', key);
    }
  });
  
  // Clear sessionStorage
  Object.keys(sessionStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      sessionStorage.removeItem(key);
      console.log('Removed:', key);
    }
  });
  
  console.log('✅ Auth data cleared. Refresh the page.');
}

// Export functions for manual use
window.debugAuth = {
  checkAuthState,
  clearAuthData,
  
  // Quick fix for stuck loading
  fixStuckLoading: () => {
    console.log('Attempting to fix stuck loading...');
    
    // Try to access React DevTools or the global auth context
    if (window.React) {
      console.log('Found React, trying to clear loading state...');
    }
    
    // Manual token refresh
    if (window.supabase) {
      window.supabase.auth.refreshSession().then(() => {
        console.log('Session refreshed');
      });
    }
    
    // Clear problematic storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    console.log('Try refreshing the page now.');
  }
};

console.log('Debug functions available: window.debugAuth');
console.log('- debugAuth.checkAuthState() - Check current auth state');
console.log('- debugAuth.clearAuthData() - Clear all auth data');
console.log('- debugAuth.fixStuckLoading() - Fix stuck loading state');

// Auto-run check
checkAuthState();