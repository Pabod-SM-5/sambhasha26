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

// Helper function: Fills the form with 100% valid data
const fillValidForm = (container: HTMLElement, email: string) => {
  const getInputByPlaceholder = (placeholder: string) => {
    return Array.from(container.querySelectorAll('input')).find(input => 
      (input as HTMLInputElement).placeholder.toLowerCase().includes(placeholder.toLowerCase())
    ) as HTMLInputElement | undefined;
  };

  // 1. School Name
  const schoolInput = getInputByPlaceholder('Nalanda College');
  if (schoolInput) fireEvent.change(schoolInput, { target: { value: 'Test School' } });

  // 2. District
  const districtInput = getInputByPlaceholder('Colombo');
  if (districtInput) fireEvent.change(districtInput, { target: { value: 'Colombo' } });

  // 3. Official Phone
  const officialPhoneInput = getInputByPlaceholder('011');
  if (officialPhoneInput) fireEvent.change(officialPhoneInput, { target: { value: '+94771234567' } });

  // 4. Address
  const addressInput = getInputByPlaceholder('School Address');
  if (addressInput) fireEvent.change(addressInput, { target: { value: '123 Main St' } });

  // 5. Contact Persons - Find by partial placeholder match
  const allInputs = container.querySelectorAll('input');
  allInputs.forEach(input => {
    const placeholder = (input as HTMLInputElement).placeholder.toLowerCase();
    if ((placeholder.includes('name') && placeholder.includes('student')) ||
        (placeholder.includes('name') && placeholder.includes('mr'))) {
      fireEvent.change(input, { target: { value: 'Amal' } });
    }
  });

  // 6. Mobile contacts - Find by "Mobile" in placeholder
  const mobileInputs = Array.from(container.querySelectorAll('input')).filter(input =>
    (input as HTMLInputElement).placeholder.toLowerCase().includes('mobile')
  );
  mobileInputs.forEach(input => {
    fireEvent.change(input, { target: { value: '+94771234567' } });
  });

  // 7. Account Details
  const emailInput = getInputByPlaceholder('mediaunit');
  if (emailInput) fireEvent.change(emailInput, { target: { value: email } });

  // 8. Passwords
  const passInputs = container.querySelectorAll('input[type="password"]');
  if (passInputs.length >= 2) {
    fireEvent.change(passInputs[0], { target: { value: 'SecurePassword123!' } });
    fireEvent.change(passInputs[1], { target: { value: 'SecurePassword123!' } });
  }
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
    fireEvent.change(passInputs[0], { target: { value: 'SecurePassword123!' } });
    fireEvent.change(passInputs[1], { target: { value: 'SecurePassword999!' } });
    
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(await findByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('checks for existing email before signup', async () => {
    // Mock existing user in database
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing-id' }, error: null })
        })
      })
    });

    const { getByText, container } = renderWithRouter(<RegisterScreen />);

    // Fill form with valid data but existing email
    fillValidForm(container, 'existing@school.lk');

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    // Wait for async validation and database check - use getByText so waitFor can retry
    await waitFor(() => {
      expect(getByText(/An account with this email already exists/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('submits valid data successfully', async () => {
    // Mock NO existing user
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    });

    // Mock successful signup
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: 'new-user' }, session: null }, 
      error: null
    });

    const { container } = renderWithRouter(<RegisterScreen />);

    // Fill form with valid data and new email
    fillValidForm(container, 'new@school.lk');

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    // Wait for form to process and signUp to be called
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@school.lk',
          password: 'SecurePassword123!'
        })
      );
    }, { timeout: 5000 });
  });
});