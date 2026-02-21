import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CategoryManager from './CategoryManager';
import { supabase } from '../../lib/supabaseClient';
import * as adminApi from '../../lib/adminApi';

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('../../lib/adminApi', () => ({
  addCategoryAdmin: vi.fn(),
  deleteCategoryAdmin: vi.fn(),
}));

vi.mock('../../lib/logger', () => ({
  logSystemAction: vi.fn(),
}));

const mockCategories = [
    { id: 1, name: 'Poetry', code: '05', division: 'Open' }
];

describe('Admin CategoryManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'categories') {
            return {
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: mockCategories, error: null })
                }),
            };
        }
        return { select: vi.fn() };
    });

    (adminApi.addCategoryAdmin as any).mockResolvedValue({
        success: true,
        message: 'Category added',
        data: { id: 2 }
    });

    (adminApi.deleteCategoryAdmin as any).mockResolvedValue({
        success: true,
        message: 'Category deleted'
    });
  });

  it('loads and displays categories', async () => {
    const { findByText } = render(<CategoryManager />);
    expect(await findByText('Poetry')).toBeInTheDocument();
    expect(await findByText('05')).toBeInTheDocument();
  });

  it('adds a new category', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<CategoryManager />);

    await findByText('Poetry');

    fireEvent.change(getByPlaceholderText(/e.g. Sinhala Announcing/i), { target: { value: 'New Event' } });
    fireEvent.change(getByPlaceholderText(/01/i), { target: { value: '99' } });
    fireEvent.change(document.querySelector('select')!, { target: { value: 'Junior' } });

    fireEvent.click(getByText(/ADD TO MATRIX/i));

    await waitFor(() => {
        expect(adminApi.addCategoryAdmin).toHaveBeenCalledWith('New Event', '99', 'Junior');
    });
  });

  it('deletes a category', async () => {
    const { findByText, container } = render(<CategoryManager />);
    await findByText('Poetry');

    const deleteBtn = container.querySelector('button.rounded-full'); 
    if (deleteBtn) {
        fireEvent.click(deleteBtn);
        
        await waitFor(() => {
            expect(adminApi.deleteCategoryAdmin).toHaveBeenCalledWith(1);
        });
    } else {
        throw new Error("Delete button not found");
    }
  });
});