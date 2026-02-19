import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RegisterScreen from './RegisterScreen';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Mock Supabase
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
    from: vi.fn(),
  },
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RegisterScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form sections', () => {
    const { getByText, getByPlaceholderText } = renderWithRouter(<RegisterScreen />);
    
    expect(getByText(/School Registration/i)).toBeInTheDocument();
    expect(getByText(/School Details/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/e.g. Nalanda College/i)).toBeInTheDocument();
  });

  it('validates password mismatch', async () => {
    const { findByText, container } = renderWithRouter(<RegisterScreen />);

    const passInputs = container.querySelectorAll('input[type="password"]');
    fireEvent.change(passInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passInputs[1], { target: { value: 'password999' } });
    
    // විසඳුම: බොත්තම Click කරනවා වෙනුවට සෘජුවම Form එක Submit කිරීම
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(await findByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('checks for existing email before signup', async () => {
    (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing-id' }, error: null })
            })
        })
    });

    const { getByPlaceholderText, findByText, container } = renderWithRouter(<RegisterScreen />);

    fireEvent.change(getByPlaceholderText(/e.g. Nalanda College/i), { target: { value: 'Test School' } });
    
    const emailInput = container.querySelector('input[type="email"]') || container.querySelectorAll('input[type="text"]')[3]; 
    if(emailInput) fireEvent.change(emailInput, { target: { value: 'existing@school.lk' } });
    
    const passInputs = container.querySelectorAll('input[type="password"]');
    if(passInputs.length >= 2) {
        fireEvent.change(passInputs[0], { target: { value: 'password123' } });
        fireEvent.change(passInputs[1], { target: { value: 'password123' } });
    }

    // විසඳුම: Form Submit කිරීම
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(await findByText(/This email is already registered/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('submits valid data successfully', async () => {
    (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
            })
        })
    });

    (supabase.auth.signUp as any).mockResolvedValue({
        data: { user: { id: 'new-user' }, session: null }, 
        error: null
    });

    const { getByPlaceholderText, findByText, container } = renderWithRouter(<RegisterScreen />);

    fireEvent.change(getByPlaceholderText(/e.g. Nalanda College/i), { target: { value: 'New School' } });
    
    const emailInput = container.querySelector('input[type="email"]');
    if(emailInput) fireEvent.change(emailInput, { target: { value: 'new@school.lk' } });

    const passInputs = container.querySelectorAll('input[type="password"]');
    if(passInputs.length >= 2) {
        fireEvent.change(passInputs[0], { target: { value: 'securepass' } });
        fireEvent.change(passInputs[1], { target: { value: 'securepass' } });
    }

    // විසඳුම: Form Submit කිරීම
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'new@school.lk',
            password: 'securepass',
            options: expect.any(Object) 
        });
    });

    expect(await findByText(/Registration Successful/i)).toBeInTheDocument();
  });
});