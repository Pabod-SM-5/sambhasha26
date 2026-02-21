/**
 * Admin API - Secure RPC Function Calls
 * All admin operations verify authorization at the DATABASE level
 * NOT just the frontend. This prevents frontend tampering.
 */

import { supabase } from './supabaseClient';
import { secureLogger } from './secureLogs';

export interface AdminApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Delete a competitor (admin-only via RPC)
 * Verifies admin status in the database before allowing deletion
 * @param competitorId The competitor ID to delete
 * @returns Response object with success status
 */
export async function deleteCompetitorAdmin(competitorId: number): Promise<AdminApiResponse> {
  try {
    secureLogger.info('Attempting admin delete competitor', { competitorId });
    
    const { data, error } = await supabase.rpc('admin_delete_competitor', {
      competitor_id: competitorId,
    });

    if (error) {
      secureLogger.error('Admin delete competitor error', { 
        error: error.message,
        code: error.code 
      });
      
      // Handle specific Supabase errors
      if (error.code === '42501') {
        return {
          success: false,
          message: 'Unauthorized: You do not have admin privileges',
        };
      }
      
      // Never expose SQL or database details to frontend
      const isDbError = error.message?.toLowerCase().includes('sql') || 
                        error.message?.toLowerCase().includes('syntax') ||
                        error.message?.toLowerCase().includes('database');
      
      return {
        success: false,
        message: isDbError ? 'An error occurred while processing your request' : error.message || 'Failed to delete competitor',
      };
    }

    // Treat null/undefined data as failure
    if (!data) {
      return {
        success: false,
        message: 'No data returned from operation',
      };
    }

    secureLogger.info('Admin delete competitor success', { competitorId });
    
    return {
      success: data?.success || false,
      message: data?.message || 'Competitor deleted',
      data: data,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    secureLogger.error('Delete competitor exception', { error: errorMsg });
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Add a new category (admin-only via RPC)
 * Verifies admin status in the database before allowing insertion
 * @param name Category name (e.g., "Sinhala Announcing")
 * @param code 2-digit code (e.g., "01")
 * @param division Category division
 * @returns Response object with success status and new category ID
 */
export async function addCategoryAdmin(
  name: string,
  code: string,
  division: string
): Promise<AdminApiResponse> {
  try {
    secureLogger.info('Attempting admin add category', { name, code, division });
    
    const { data, error } = await supabase.rpc('admin_add_category', {
      cat_name: name.trim(),
      cat_code: code.trim(),
      cat_division: division,
    });

    if (error) {
      secureLogger.error('Admin add category error', { 
        error: error.message,
        code: error.code 
      });
      
      // Handle specific Supabase errors
      if (error.code === '42501') {
        return {
          success: false,
          message: 'Unauthorized: You do not have admin privileges',
        };
      }
      
      if (error.code === '23505') {
        // Unique constraint violation
        return {
          success: false,
          message: 'Category name or code already exists',
        };
      }
      
      if (error.code === '22023') {
        // Invalid input
        return {
          success: false,
          message: 'Invalid category information',
        };
      }
      
      // Never expose database details
      const isDbError = error.message?.toLowerCase().includes('sql') || 
                        error.message?.toLowerCase().includes('syntax') ||
                        error.message?.toLowerCase().includes('database');
      
      return {
        success: false,
        message: isDbError ? 'An error occurred while processing your request' : error.message || 'Failed to add category',
      };
    }

    secureLogger.info('Admin add category success', { name, newCategoryId: data?.category_id });
    
    return {
      success: data?.success || false,
      message: data?.message || 'Category added',
      data: data,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    secureLogger.error('Add category exception', { error: errorMsg });
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Delete a category (admin-only via RPC)
 * Verifies admin status in the database before allowing deletion
 * @param categoryId The category ID to delete
 * @returns Response object with success status
 */
export async function deleteCategoryAdmin(categoryId: number): Promise<AdminApiResponse> {
  try {
    secureLogger.info('Attempting admin delete category', { categoryId });
    
    const { data, error } = await supabase.rpc('admin_delete_category', {
      category_id: categoryId,
    });

    if (error) {
      secureLogger.error('Admin delete category error', { 
        error: error.message,
        code: error.code 
      });
      
      // Handle specific Supabase errors
      if (error.code === '42501') {
        return {
          success: false,
          message: 'Unauthorized: You do not have admin privileges',
        };
      }
      
      // Never expose database details
      const isDbError = error.message?.toLowerCase().includes('sql') || 
                        error.message?.toLowerCase().includes('syntax') ||
                        error.message?.toLowerCase().includes('database');
      
      return {
        success: false,
        message: isDbError ? 'An error occurred while processing your request' : error.message || 'Failed to delete category',
      };
    }

    secureLogger.info('Admin delete category success', { categoryId });
    
    return {
      success: data?.success || false,
      message: data?.message || 'Category deleted',
      data: data,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    secureLogger.error('Delete category exception', { error: errorMsg });
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Example: Check if current user is admin (client-side check only)
 * NOTE: This is NOT secure by itself! Always rely on RPC functions that check is_admin()
 * This is useful for UI decisions (show/hide buttons) but never for actual authorization
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error || !profile) {
      return false;
    }

    return profile.role === 'admin';
  } catch {
    return false;
  }
}
