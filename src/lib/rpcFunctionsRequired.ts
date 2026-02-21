/**
 * REQUIRED RPC FUNCTIONS FOR ADMIN API
 * 
 * These functions MUST be created in your Supabase database.
 * Without them, admin operations will fail silently.
 * 
 * Location: Supabase SQL Editor
 */

/**
 * Required RPC: admin_delete_competitor
 * 
 * Creates a SQL function that:
 * 1. Verifies current user is admin (using is_admin() check)
 * 2. Deletes competitor from database
 * 3. Returns success/failure status
 * 
 * @param competitor_id INTEGER - ID of competitor to delete
 * @returns JSON with { success: boolean, message: string }
 */
// TODO: Create this function in Supabase:
/*
CREATE OR REPLACE FUNCTION admin_delete_competitor(
  competitor_id INTEGER
) RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Delete competitor
  DELETE FROM competitors WHERE id = competitor_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Competitor deleted successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

/**
 * Required RPC: admin_add_category
 * 
 * Creates a SQL function that:
 * 1. Verifies current user is admin
 * 2. Validates inputs
 * 3. Inserts new category
 * 4. Returns success/failure status with new category ID
 * 
 * @param cat_name VARCHAR - Name of category
 * @param cat_code VARCHAR - 2-digit category code
 * @param cat_division VARCHAR - Category division
 * @returns JSON with { success: boolean, message: string, category_id?: integer }
 */
// TODO: Create this function in Supabase:
/*
CREATE OR REPLACE FUNCTION admin_add_category(
  cat_name VARCHAR,
  cat_code VARCHAR,
  cat_division VARCHAR
) RETURNS JSON AS $$
DECLARE
  new_category_id INTEGER;
  result JSON;
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Insert category
  INSERT INTO categories (name, code, division)
  VALUES (cat_name, cat_code, cat_division)
  RETURNING id INTO new_category_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Category added successfully',
    'category_id', new_category_id
  );
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object(
    'success', false,
    'message', 'Category name or code already exists'
  );
WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

/**
 * Required RPC: admin_delete_category
 * 
 * Creates a SQL function that:
 * 1. Verifies current user is admin
 * 2. Deletes category from database
 * 3. Returns success/failure status
 * 
 * @param category_id INTEGER - ID of category to delete
 * @returns JSON with { success: boolean, message: string }
 */
// TODO: Create this function in Supabase:
/*
CREATE OR REPLACE FUNCTION admin_delete_category(
  category_id INTEGER
) RETURNS JSON AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Delete category
  DELETE FROM categories WHERE id = category_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Category deleted successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

/**
 * HELPER FUNCTION: is_admin()
 * 
 * This function should be created first as it's used by all admin operations.
 * It checks if current user's role is 'admin' in the profiles table.
 * 
 * @returns BOOLEAN - true if user is admin, false otherwise
 */
// TODO: Create this helper function in Supabase:
/*
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role = 'admin' FROM profiles WHERE id = auth.uid());
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

export const requiredRPCFunctions = [
  'is_admin',
  'admin_delete_competitor',
  'admin_add_category',
  'admin_delete_category',
];

export const rpcDocumentation = {
  admin_delete_competitor: {
    description: 'Delete a competitor (admin-only via RPC)',
    parameters: {
      competitor_id: 'INTEGER - ID of competitor to delete',
    },
    returns: 'JSON with success status',
  },
  admin_add_category: {
    description: 'Add a new category (admin-only via RPC)',
    parameters: {
      cat_name: 'VARCHAR - Name of category',
      cat_code: 'VARCHAR - 2-digit category code',
      cat_division: 'VARCHAR - Category division',
    },
    returns: 'JSON with success status and new category ID',
  },
  admin_delete_category: {
    description: 'Delete a category (admin-only via RPC)',
    parameters: {
      category_id: 'INTEGER - ID of category to delete',
    },
    returns: 'JSON with success status',
  },
};

export default {
  requiredRPCFunctions,
  rpcDocumentation,
};
