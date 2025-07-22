import { supabase } from './supabase';

class UserService {
  // Get all user profiles with optional filters
  async getAllUsers(filters = {}) {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,user_id.ilike.%${filters.search}%`);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to load users' };
    }
  }

  // Get single user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to load user profile' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  // Update user status
  async updateUserStatus(userId, status) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update user status' };
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      // First get current user to generate new user_id
      const currentUserResult = await this.getUserProfile(userId);
      if (!currentUserResult.success) {
        return currentUserResult;
      }

      // Generate new user ID for the new role
      const { data: existingUsers } = await supabase
        .from('user_profiles')
        .select('user_id')
        .like('user_id', `${role === 'admin' ? 'ADMIN' : 'USER'}-%`)
        .order('user_id', { ascending: false });

      const prefix = role === 'admin' ? 'ADMIN' : 'USER';
      const existingIds = existingUsers?.map(u => {
        const num = u.user_id.split('-')[1];
        return parseInt(num);
      }).filter(n => !isNaN(n)) || [];

      const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
      const newUserId = `${prefix}-${nextNumber.toString().padStart(3, '0')}`;

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          role: role,
          user_id: newUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update user role' };
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('role, status, active_loans');

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        totalUsers: users?.length || 0,
        adminUsers: users?.filter(user => user.role === 'admin').length || 0,
        activeUsers: users?.filter(user => user.status === 'active').length || 0,
        totalActiveLoans: users?.reduce((sum, user) => sum + (user.active_loans || 0), 0) || 0
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to load user statistics' };
    }
  }

  // Create new user profile (admin only)
  async createUserProfile(userData) {
    try {
      // Generate user ID
      const role = userData.role || 'user';
      const prefix = role === 'admin' ? 'ADMIN' : 'USER';
      
      const { data: existingUsers } = await supabase
        .from('user_profiles')
        .select('user_id')
        .like('user_id', `${prefix}-%`)
        .order('user_id', { ascending: false });

      const existingIds = existingUsers?.map(u => {
        const num = u.user_id.split('-')[1];
        return parseInt(num);
      }).filter(n => !isNaN(n)) || [];

      const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
      const newUserId = `${prefix}-${nextNumber.toString().padStart(3, '0')}`;

      // Note: This would typically involve creating an auth user first
      // For now, we'll assume the auth user creation happens elsewhere
      const profileData = {
        user_id: newUserId,
        email: userData.email,
        full_name: userData.full_name,
        role: role,
        status: userData.status || 'active',
        active_loans: 0
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create user profile' };
    }
  }
}

const userService = new UserService();
export default userService;