/**
 * Input Validators for Security
 * Prevents injection attacks and ensures data integrity
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate password strength
 * Minimum 12 characters with complexity requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*)' };
  }

  return { valid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true };
};

/**
 * Validate school name (limit length and special characters)
 */
export const validateSchoolName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'School name is required' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'School name must not exceed 100 characters' };
  }

  // Allow letters, numbers, spaces, hyphens, apostrophes, and periods
  if (!/^[a-zA-Z0-9\s\-'.]+$/.test(name)) {
    return { valid: false, error: 'School name contains invalid characters' };
  }

  return { valid: true };
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Accept common phone formats (digits, spaces, hyphens, parentheses, +)
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }

  return { valid: true };
};

/**
 * Validate NIC/ID format (supports various formats)
 */
export const validateNIC = (nic: string): ValidationResult => {
  if (!nic || nic.trim().length === 0) {
    return { valid: false, error: 'NIC/ID is required' };
  }

  // Allow alphanumeric with hyphens (common NIC format: XXXXXXXXX-V or similar)
  if (!/^[a-zA-Z0-9\-]+$/.test(nic)) {
    return { valid: false, error: 'NIC/ID contains invalid characters' };
  }

  if (nic.length < 5 || nic.length > 20) {
    return { valid: false, error: 'NIC/ID must be between 5 and 20 characters' };
  }

  return { valid: true };
};

/**
 * Validate name (first/last name)
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (name.length > 50) {
    return { valid: false, error: `${fieldName} must not exceed 50 characters` };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }

  return { valid: true };
};

/**
 * Validate address
 */
export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim().length === 0) {
    return { valid: false, error: 'Address is required' };
  }

  if (address.length > 200) {
    return { valid: false, error: 'Address must not exceed 200 characters' };
  }

  return { valid: true };
};

/**
 * Validate district
 */
export const validateDistrict = (district: string): ValidationResult => {
  if (!district || district.trim().length === 0) {
    return { valid: false, error: 'District is required' };
  }

  if (district.length > 50) {
    return { valid: false, error: 'District must not exceed 50 characters' };
  }

  return { valid: true };
};

/**
 * Validate file MIME type (for uploads)
 */
export const validateFileMimeType = (file: File, allowedTypes: string[]): ValidationResult => {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeInMB: number): ValidationResult => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    return { valid: false, error: `File size must not exceed ${maxSizeInMB}MB` };
  }

  return { valid: true };
};

/**
 * Sanitize string input - removes potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 500); // Limit length
};

/**
 * Validate category code (alphanumeric, max 2 chars)
 */
export const validateCategoryCode = (code: string): ValidationResult => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Category code is required' };
  }

  if (!/^[a-zA-Z0-9]+$/.test(code)) {
    return { valid: false, error: 'Category code must be alphanumeric' };
  }

  if (code.length > 2) {
    return { valid: false, error: 'Category code must not exceed 2 characters' };
  }

  return { valid: true };
};

/**
 * Constant-time string comparison (prevents timing attacks)
 */
export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};
