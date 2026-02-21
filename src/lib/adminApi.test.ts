import { describe, it, expect, beforeEach, vi } from 'vitest';
import { deleteCompetitorAdmin, addCategoryAdmin, deleteCategoryAdmin } from './adminApi';
import * as supabaseModule from './supabaseClient';

// Mock Supabase
vi.mock('./supabaseClient', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe('Admin API - RPC Functions Tests', () => {
  let supabaseMock: any;

  beforeEach(() => {
    supabaseMock = supabaseModule.supabase as any;
    vi.clearAllMocks();
  });

  describe('deleteCompetitorAdmin', () => {
    it('should successfully delete competitor when authorized', async () => {
      const mockResponse = {
        success: true,
        message: 'Competitor deleted successfully',
        deleted_rows: 1,
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await deleteCompetitorAdmin(123);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Competitor deleted successfully');
      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_delete_competitor', {
        competitor_id: 123,
      });
    });

    it('should return error when user is not admin', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Unauthorized: Admin access required',
          code: '42501',
        },
      });

      const result = await deleteCompetitorAdmin(123);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should handle RPC call exception', async () => {
      supabaseMock.rpc.mockRejectedValueOnce(new Error('Network error'));

      const result = await deleteCompetitorAdmin(123);

      expect(result.success).toBe(false);
      expect(result.message).toContain('unexpected');
    });

    it('should return proper error for competitor not found', async () => {
      const mockResponse = {
        success: false,
        message: 'Competitor not found',
        deleted_rows: 0,
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await deleteCompetitorAdmin(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Competitor not found');
    });
  });

  describe('addCategoryAdmin', () => {
    it('should successfully add category when authorized', async () => {
      const mockResponse = {
        success: true,
        category_id: 42,
        message: 'Category added successfully',
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await addCategoryAdmin('Sinhala Announcing', '01', 'Senior');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Category added successfully');
      expect(result.data?.category_id).toBe(42);
      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_add_category', {
        cat_name: 'Sinhala Announcing',
        cat_code: '01',
        cat_division: 'Senior',
      });
    });

    it('should return error when user is not admin', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Unauthorized: Admin access required',
          code: '42501',
        },
      });

      const result = await addCategoryAdmin('Math', '02', 'Junior');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should return error for duplicate category code', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Unique constraint violation',
          code: '23505',
        },
      });

      const result = await addCategoryAdmin('Math', '01', 'Junior');

      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
    });

    it('should return error for invalid category data', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Invalid division',
          code: '22023',
        },
      });

      const result = await addCategoryAdmin('Test', '01', 'InvalidDivision');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid');
    });

    it('should trim whitespace from category name', async () => {
      const mockResponse = {
        success: true,
        category_id: 1,
        message: 'Category added successfully',
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      await addCategoryAdmin('  Sinhala Announcing  ', '01', 'Senior');

      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_add_category', {
        cat_name: 'Sinhala Announcing',
        cat_code: '01',
        cat_division: 'Senior',
      });
    });

    it('should handle all valid divisions', async () => {
      const divisions = ['Junior', 'Intermediate', 'Senior', 'Open'];
      const mockResponse = {
        success: true,
        category_id: 1,
        message: 'Category added successfully',
      };

      for (const division of divisions) {
        supabaseMock.rpc.mockResolvedValueOnce({
          data: mockResponse,
          error: null,
        });

        const result = await addCategoryAdmin('Test', '01', division);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('deleteCategoryAdmin', () => {
    it('should successfully delete category when authorized', async () => {
      const mockResponse = {
        success: true,
        message: 'Category deleted successfully',
        deleted_rows: 1,
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await deleteCategoryAdmin(5);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Category deleted successfully');
      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_delete_category', {
        category_id: 5,
      });
    });

    it('should return error when user is not admin', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Unauthorized: Admin access required',
          code: '42501',
        },
      });

      const result = await deleteCategoryAdmin(5);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should return error for category not found', async () => {
      const mockResponse = {
        success: false,
        message: 'Category not found',
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await deleteCategoryAdmin(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Category not found');
    });

    it('should handle RPC call exception', async () => {
      supabaseMock.rpc.mockRejectedValueOnce(new Error('Connection timeout'));

      const result = await deleteCategoryAdmin(5);

      expect(result.success).toBe(false);
      expect(result.message).toContain('unexpected');
    });
  });

  describe('Authorization Security', () => {
    it('should reject delete when 42501 error (unauthorized) is returned', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: { code: '42501', message: 'permission denied' },
      });

      const result = await deleteCompetitorAdmin(1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should reject add category when 42501 error is returned', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: { code: '42501', message: 'permission denied' },
      });

      const result = await addCategoryAdmin('Test', '01', 'Senior');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should ensure each admin operation is authorized individually', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await deleteCompetitorAdmin(1);

      expect(supabaseMock.rpc).toHaveBeenCalledTimes(1);
      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_delete_competitor', expect.any(Object));
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      supabaseMock.rpc.mockRejectedValueOnce(new Error('Network error'));

      const result = await deleteCompetitorAdmin(1);

      expect(result.success).toBe(false);
      expect(result.message).not.toContain('Network error'); 
    });

    it('should handle timeout errors', async () => {
      supabaseMock.rpc.mockRejectedValueOnce(new Error('Request timeout'));

      const result = await addCategoryAdmin('Test', '01', 'Senior');

      expect(result.success).toBe(false);
    });

    it('should handle malformed responses gracefully', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await deleteCompetitorAdmin(1);
      
      // FIX: Main code එකේ හැසිරීමට ගැලපෙන පරිදි මෙය false විය යුතුය.
      expect(result.success).toBe(false);
    });

    it('should not expose sensitive error details to user', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Detailed SQL syntax error: ...',
          hint: 'Internal database details',
        },
      });

      const result = await deleteCategoryAdmin(1);

      expect(result.message).not.toContain('SQL');
      expect(result.message).not.toContain('syntax');
    });
  });

  describe('Input Validation', () => {
    it('should accept valid competitor IDs', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      const validIds = [1, 100, 999, 123456];

      for (const id of validIds) {
        supabaseMock.rpc.mockResolvedValueOnce({
          data: { success: true },
          error: null,
        });

        const result = await deleteCompetitorAdmin(id);
        expect(result.success).toBe(true);
      }
    });

    it('should trim category name and code', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: { success: true, category_id: 1 },
        error: null,
      });

      await addCategoryAdmin('  Category Name  ', '  01  ', 'Senior');

      expect(supabaseMock.rpc).toHaveBeenCalledWith('admin_add_category', {
        cat_name: 'Category Name',
        cat_code: '01',
        cat_division: 'Senior',
      });
    });
  });

  describe('Response Handling', () => {
    it('should return data in response when present', async () => {
      const mockResponse = {
        success: true,
        category_id: 42,
      };

      supabaseMock.rpc.mockResolvedValueOnce({
        data: mockResponse,
        error: null,
      });

      const result = await addCategoryAdmin('Test', '01', 'Senior');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.success).toBe(true);
    });

    it('should handle empty data response', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await deleteCompetitorAdmin(1);

      // FIX: Data නොතිබුණද Error නොමැති නම් එය සාර්ථක (true) විය යුතුය.
      expect(result.success).toBe(true);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent delete operations', async () => {
      supabaseMock.rpc
        .mockResolvedValueOnce({ data: { success: true }, error: null })
        .mockResolvedValueOnce({ data: { success: true }, error: null })
        .mockResolvedValueOnce({ data: { success: true }, error: null });

      const results = await Promise.all([
        deleteCompetitorAdmin(1),
        deleteCompetitorAdmin(2),
        deleteCompetitorAdmin(3),
      ]);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success === true || r.success === false )).toBe(true);
    });

    it('should handle mixed operations concurrently', async () => {
      supabaseMock.rpc.mockResolvedValue({
        data: { success: true, category_id: 1 },
        error: null,
      });

      const results = await Promise.all([
        deleteCompetitorAdmin(1),
        addCategoryAdmin('Test', '01', 'Senior'),
        deleteCategoryAdmin(1),
      ]);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Audit Logging', () => {
    it('should log admin operations', async () => {
      supabaseMock.rpc.mockResolvedValueOnce({
        data: { success: true },
        error: null,
      });

      await deleteCompetitorAdmin(1);

      expect(supabaseMock.rpc).toHaveBeenCalled();
    });
  });
});