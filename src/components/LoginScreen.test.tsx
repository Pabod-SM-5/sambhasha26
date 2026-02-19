import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginScreen from './LoginScreen';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Mock Supabase Client
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock Logger
vi.mock('../lib/logger', () => ({
  logSystemAction: vi.fn(),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithRouter(<LoginScreen />);
    
    expect(getByPlaceholderText(/admin@nalanda.lk/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(getByText(/Secure Login/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = renderWithRouter(<LoginScreen />);
    
    const emailInput = getByPlaceholderText(/admin@nalanda.lk/i) as HTMLInputElement;
    const passwordInput = getByPlaceholderText(/••••••••••••/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@school.lk' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@school.lk');
    expect(passwordInput.value).toBe('password123');
  });

  it('displays error on failed login', async () => {
    // Mock failed login
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    const { getByPlaceholderText, getByRole, findByText } = renderWithRouter(<LoginScreen />);
    
    fireEvent.change(getByPlaceholderText(/admin@nalanda.lk/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(getByPlaceholderText(/••••••••••••/i), { target: { value: 'wrongpass' } });
    fireEvent.click(getByRole('button', { name: /Secure Login/i }));

    expect(await findByText(/Invalid email or password/i)).toBeInTheDocument();
  });

  it('calls signInWithPassword with correct credentials', async () => {
    // Mock successful auth but fail profile fetch to stop redirect logic for this test
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    // Mock Profile Fetch to return null so it doesn't crash on redirect logic
    const maybeSingleMock = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                maybeSingle: maybeSingleMock
            })
        })
    });

    const { getByPlaceholderText, getByRole } = renderWithRouter(<LoginScreen />);
    
    fireEvent.change(getByPlaceholderText(/admin@nalanda.lk/i), { target: { value: 'user@school.lk' } });
    fireEvent.change(getByPlaceholderText(/••••••••••••/i), { target: { value: 'correcthorse' } });
    fireEvent.click(getByRole('button', { name: /Secure Login/i }));

    await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'user@school.lk',
            password: 'correcthorse',
        });
    });
  });
});