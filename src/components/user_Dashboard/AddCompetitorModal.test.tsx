import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AddCompetitorModal from './AddCompetitorModal';
import { supabase } from '../../lib/supabaseClient';

// Mock Supabase
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockCategories = [
  { id: '1', name: 'Announcing', code: '01', division: 'Junior' },
  { id: '2', name: 'Editing', code: '02', division: 'Senior' },
];

describe('AddCompetitorModal', () => {
  const mockOnClose = vi.fn();
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Mock for categories fetch
    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'categories') {
            return {
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: mockCategories, error: null })
                })
            };
        }
        if (table === 'competitors') {
            return {
                select: vi.fn().mockReturnValue({
                    ilike: vi.fn().mockReturnValue({
                        order: vi.fn().mockReturnValue({
                            limit: vi.fn().mockReturnValue({
                                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) // No previous competitors
                            })
                        })
                    })
                })
            };
        }
        return { select: vi.fn() };
    });
  });

  it('renders correctly and loads categories', async () => {
    const { getByText } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    expect(getByText(/Register Contestant/i)).toBeInTheDocument();
    
    // Check if categories loaded in select
    await waitFor(() => {
        expect(getByText(/\[01\] Announcing \(Junior\)/i)).toBeInTheDocument();
    });
  });

  it('validates Age Division correctly', async () => {
    const { getByText, getByPlaceholderText, getByRole, getAllByRole, findByText } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    // Wait for cats
    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    // Fill Name
    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Test Student' } });

    // Select Junior Category
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });

    // Enter Invalid DOB for Junior (Junior is 2011-2014) -> Enter 2005
    // Note: Input type='date' value format is YYYY-MM-DD
    const dobInput = getAllByRole('textbox').find(e => e.getAttribute('type') === 'date') || document.querySelector('input[type="date"]');
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2005-01-01' } });

    // Submit
    fireEvent.click(getByText(/Confirm Registration/i));

    // Expect Error
    expect(await findByText(/Invalid DOB for Junior Division/i)).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('generates ID and submits on valid data', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    // Wait for cats
    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    // Fill Valid Data
    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Test Student' } });
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } }); // Junior (Code 01)
    
    const dobInput = document.querySelector('input[type="date"]');
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2012-01-01' } }); // Valid Junior Year

    fireEvent.click(getByText(/Confirm Registration/i));

    await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Student',
            category: 'Announcing',
            contestId: 'NC-26-01-001', // First ID generated
            dob: '2012-01-01'
        }));
    });
  });

  it('increments sequence number based on existing competitors', async () => {
    // Override mock to return an existing competitor with ID 005
    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'categories') {
            return {
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: mockCategories, error: null })
                })
            };
        }
        if (table === 'competitors') {
            return {
                select: vi.fn().mockReturnValue({
                    ilike: vi.fn().mockReturnValue({
                        order: vi.fn().mockReturnValue({
                            limit: vi.fn().mockReturnValue({
                                // Simulating last ID was ...005
                                maybeSingle: vi.fn().mockResolvedValue({ 
                                    data: { contest_id: 'NC-26-01-005' }, 
                                    error: null 
                                }) 
                            })
                        })
                    })
                })
            };
        }
    });

    const { getByText, getByPlaceholderText, getByRole } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Next Student' } });
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } }); // Code 01
    
    const dobInput = document.querySelector('input[type="date"]');
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2012-01-01' } });

    fireEvent.click(getByText(/Confirm Registration/i));

    await waitFor(() => {
        // Should be 006 now
        expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
            contestId: 'NC-26-01-006' 
        }));
    });
  });
});