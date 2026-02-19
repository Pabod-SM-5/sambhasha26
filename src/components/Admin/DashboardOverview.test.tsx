import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DashboardOverview from './DashboardOverview';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

const confirmSpy = vi.spyOn(window, 'confirm');

const mockSchools = [
  { id: '1', school_name: 'Alpha College', district: 'Colombo', status: 'active', role: 'user', created_at: '2024-01-01' },
  { id: '2', school_name: 'Beta School', district: 'Gampaha', status: 'inactive', role: 'user', created_at: '2024-01-02' },
];

describe('Admin DashboardOverview', () => {
  let mockUpdate: any;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy.mockImplementation(() => true); 

    mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
    });

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({ data: mockSchools, error: null })
                    })
                }),
                update: mockUpdate
            };
        }
        if (table === 'competitors') {
            return {
                select: vi.fn().mockResolvedValue({ count: 50, error: null })
            };
        }
        return { select: vi.fn() };
    });
  });

  it('renders stats and school list', async () => {
    const { getByText, findByText } = render(
        <BrowserRouter>
            <DashboardOverview />
        </BrowserRouter>
    );

    await waitFor(() => expect(supabase.from).toHaveBeenCalledTimes(2));

    expect(getByText(/Registered Schools/i)).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument(); 
    expect(getByText('50')).toBeInTheDocument(); 

    expect(await findByText('Alpha College')).toBeInTheDocument();
    expect(await findByText('Beta School')).toBeInTheDocument();
  });

  it('filters schools by search term', async () => {
    const { getByPlaceholderText, queryByText, findByText, getByText } = render(
        <BrowserRouter>
            <DashboardOverview />
        </BrowserRouter>
    );

    await findByText('Alpha College');

    const searchInput = getByPlaceholderText(/SEARCH_DB.../i);
    fireEvent.change(searchInput, { target: { value: 'Gampaha' } });

    expect(queryByText('Alpha College')).not.toBeInTheDocument();
    expect(getByText('Beta School')).toBeInTheDocument();
  });

  it('toggles school status', async () => {
    const { getAllByTitle, findByText } = render(
        <BrowserRouter>
            <DashboardOverview />
        </BrowserRouter>
    );

    await findByText('Alpha College');

    const toggleBtns = getAllByTitle(/Deactivate Account/i);
    fireEvent.click(toggleBtns[0]);

    expect(confirmSpy).toHaveBeenCalled();
    
    await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({ status: 'inactive' });
    });
  });

  it('handles delete flow with modal and RPC', async () => {
    const { getAllByTitle, getByText, findByText, queryByText, getAllByText } = render(
        <BrowserRouter>
            <DashboardOverview />
        </BrowserRouter>
    );

    await findByText('Alpha College');

    const deleteBtns = getAllByTitle(/Permanently Delete/i);
    fireEvent.click(deleteBtns[0]);

    expect(getByText(/Critical Action/i)).toBeInTheDocument();
    // Use getAllByText to handle multiple instances of "Alpha College" on screen
    expect(getAllByText(/Alpha College/i)[0]).toBeInTheDocument();

    (supabase.rpc as any).mockResolvedValue({ error: null });

    const confirmBtn = getByText(/Confirm Delete/i);
    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith('delete_user_by_admin', { target_user_id: '1' });
    });

    expect(queryByText('Alpha College')).not.toBeInTheDocument();
  });
});