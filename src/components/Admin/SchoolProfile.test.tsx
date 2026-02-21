import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SchoolProfile from './SchoolProfile';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import * as adminApi from '../../lib/adminApi';

vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('../../lib/adminApi', () => ({
  deleteCompetitorAdmin: vi.fn(),
}));

vi.mock('../../lib/logger', () => ({
  logSystemAction: vi.fn(),
}));

const mockProfile = {
    id: '123',
    school_name: 'Nalanda College',
    district: 'Colombo',
    phone: '0112345678',
    tic_name: 'Mr. Teacher'
};

const mockCompetitors = [
    { id: 101, school_id: '123', name: 'Student One', contest_id: 'NC-26-01-001', category: 'Announcing', dob: '2010-01-01' }
];

describe('Admin SchoolProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null })
                    })
                })
            };
        }
        if (table === 'competitors') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        order: vi.fn().mockResolvedValue({ data: mockCompetitors, error: null })
                    })
                })
            };
        }
        return { select: vi.fn() };
    });

    (adminApi.deleteCompetitorAdmin as any).mockResolvedValue({
        success: true,
        message: 'Competitor deleted'
    });
  });

  const renderComponent = () => {
    return render(
        <MemoryRouter initialEntries={['/admin/school/123']}>
            <Routes>
                <Route path="/admin/school/:schoolId" element={<SchoolProfile />} />
            </Routes>
        </MemoryRouter>
    );
  };
  
  it('renders school details and contestants', async () => {
    const { findByText, getByText } = renderComponent();

    expect(await findByText('Nalanda College')).toBeInTheDocument();
    expect(getByText('Mr. Teacher')).toBeInTheDocument();
    expect(getByText('Student One')).toBeInTheDocument();
    expect(getByText('NC-26-01-001')).toBeInTheDocument();
  });

  it('deletes a contestant', async () => {
    const { findByText, getByText, getAllByText } = renderComponent();
    await findByText('Student One');

    const deleteBtns = document.querySelectorAll('button'); 
    const rowDeleteBtn = deleteBtns[deleteBtns.length - 1]; 
    fireEvent.click(rowDeleteBtn);

    expect(getByText(/Remove Contestant/i)).toBeInTheDocument();
    // Multiple elements error එක මගහරවා ගැනීම සඳහා getAllByText භාවිතය
    expect(getAllByText(/Student One/i)[0]).toBeInTheDocument();

    const confirmBtn = getByText(/Delete Entry/i);
    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(adminApi.deleteCompetitorAdmin).toHaveBeenCalledWith(101);
    });
  });
});