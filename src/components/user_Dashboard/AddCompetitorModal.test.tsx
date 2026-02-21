import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AddCompetitorModal from './AddCompetitorModal';
import { supabase } from '../../lib/supabaseClient';
import * as validators from '../../lib/validators';
import * as competitionLogic from '../../lib/competitionLogic';

// Mock Supabase
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

// Mock validators and competitionLogic (use actual implementations)
vi.mock('../../lib/validators', async () => {
  const actual = await vi.importActual('../../lib/validators');
  return actual;
});

vi.mock('../../lib/competitionLogic', async () => {
  const actual = await vi.importActual('../../lib/competitionLogic');
  return actual;
});

vi.mock('../../lib/secureLogs', () => ({
  secureLogger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
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
        // Create a chain that supports both limit check and ID generation patterns
        const createSelectChain = () => ({
          // For limit check: .eq('category', ...).eq('school_id', ...)
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          }),
          // For ID generation: .ilike('contest_id', ...).order(...).limit(...).maybeSingle()
          ilike: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
              })
            })
          })
        });

        return {
          select: vi.fn().mockReturnValue(createSelectChain())
        };
      }
      return { select: vi.fn() };
    });

    // Mock auth.getUser() for competitor limit check
    (supabase.auth.getUser as any).mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id'
        }
      }
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

    // Wait for categories
    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    // Fill Name
    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Test Student' } });

    // Select Junior Category
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });

    // Enter Invalid DOB for Junior (Junior is 2013-2015) -> Enter 2005 (outside allowed years)
    const dobInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2005-01-01' } });

    // Enter valid contact
    fireEvent.change(getByPlaceholderText(/071 XXXXXXX/i), { target: { value: '0771234567' } });

    // Submit
    fireEvent.click(getByText(/Confirm Registration/i));

    // Expect Error - validateBirthYear returns "Invalid DOB for Junior Division. Allowed years: 2013, 2014, 2015"
    const errorMsg = await findByText(/Invalid DOB for Junior Division/i);
    expect(errorMsg).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('generates ID and submits on valid data', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    // Wait for categories
    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    // Fill Valid Data
    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Test Student' } });
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } }); // Junior (Code 01)
    
    const dobInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2014-01-01' } }); // Valid Junior Year 2014

    fireEvent.change(getByPlaceholderText(/071 XXXXXXX/i), { target: { value: '0771234567' } }); // Valid phone

    fireEvent.click(getByText(/Confirm Registration/i));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Student',
        category: 'Announcing',
        contestId: 'NC-26-01-001', // First ID generated
        dob: '2014-01-01'
      }));
    }, { timeout: 3000 });
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
        // Create a chain that supports both limit check and ID generation patterns
        const createSelectChain = () => ({
          // For limit check: .eq('category', ...).eq('school_id', ...)
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          }),
          // For ID generation: .ilike('contest_id', ...).order(...).limit(...).maybeSingle()
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
        });

        return {
          select: vi.fn().mockReturnValue(createSelectChain())
        };
      }
    });

    const { getByText, getByPlaceholderText, getByRole } = render(<AddCompetitorModal onClose={mockOnClose} onAdd={mockOnAdd} />);

    await waitFor(() => expect(getByText(/\[01\] Announcing/i)).toBeInTheDocument());

    fireEvent.change(getByPlaceholderText(/Full Name/i), { target: { value: 'Next Student' } });
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } }); // Code 01
    
    const dobInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dobInput) fireEvent.change(dobInput, { target: { value: '2014-01-01' } });

    fireEvent.change(getByPlaceholderText(/071 XXXXXXX/i), { target: { value: '0771234567' } });

    fireEvent.click(getByText(/Confirm Registration/i));

    await waitFor(() => {
      // Should be 006 now (incremented from 005)
      expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
        contestId: 'NC-26-01-006' 
      }));
    }, { timeout: 3000 });
  });
});