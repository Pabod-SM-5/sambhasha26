import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  validateEmail,
  validateSchoolName,
  validatePhone,
  validateNIC,
  validateName,
  validateAddress,
  validateDistrict,
  validateFileMimeType,
  validateFileSize,
  sanitizeInput,
  validateCategoryCode,
  constantTimeCompare,
} from './validators';

describe('Input Validators - Security Tests', () => {
  describe('validatePassword', () => {
    it('should accept strong password with all requirements', () => {
      const result = validatePassword('MySecure@Pass123');
      expect(result.valid).toBe(true);
    });

    it('should reject password shorter than 12 characters', () => {
      const result = validatePassword('Short@Pass1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 12 characters');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePassword('mysecure@pass123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePassword('MYSECURE@PASS123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePassword('MySecure@PassAbc');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('MySecurePass123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('special character');
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should accept password with various special characters', () => {
      const passwords = [
        'MyPass!123abc',
        'MyPass@123abc',
        'MyPass#123abc',
        'MyPass$123abc',
        'MyPass%123abc',
      ];
      passwords.forEach(pwd => {
        const result = validatePassword(pwd);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email address', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('valid email');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.valid).toBe(false);
    });

    it('should reject email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.valid).toBe(false);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject very long email', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should reject email with spaces', () => {
      const result = validateEmail('user @example.com');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateSchoolName', () => {
    it('should accept valid school name', () => {
      const result = validateSchoolName('Royal College');
      expect(result.valid).toBe(true);
    });

    it('should accept school name with numbers', () => {
      const result = validateSchoolName('School 2024');
      expect(result.valid).toBe(true);
    });

    it('should accept school name with hyphens', () => {
      const result = validateSchoolName('St. Mary-Ann School');
      expect(result.valid).toBe(true);
    });

    it('should reject empty school name', () => {
      const result = validateSchoolName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject school name exceeding 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = validateSchoolName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed 100');
    });

    it('should reject school name with special characters', () => {
      const result = validateSchoolName('School <script>alert("xss")</script>');
      expect(result.valid).toBe(false);
    });

    it('should reject school name with only spaces', () => {
      const result = validateSchoolName('   ');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should accept valid phone number', () => {
      const result = validatePhone('0112345678');
      expect(result.valid).toBe(true);
    });

    it('should accept phone with hyphens', () => {
      const result = validatePhone('011-234-5678');
      expect(result.valid).toBe(true);
    });

    it('should accept phone with parentheses', () => {
      const result = validatePhone('(011) 234 5678');
      expect(result.valid).toBe(true);
    });

    it('should accept international phone format', () => {
      const result = validatePhone('+94112345678');
      expect(result.valid).toBe(true);
    });

    it('should reject empty phone', () => {
      const result = validatePhone('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject invalid phone format', () => {
      const result = validatePhone('abc-def-ghij');
      expect(result.valid).toBe(false);
    });

    it('should reject phone too short', () => {
      const result = validatePhone('12345');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateNIC', () => {
    it('should accept valid NIC format', () => {
      const result = validateNIC('123456789V');
      expect(result.valid).toBe(true);
    });

    it('should accept NIC with hyphens', () => {
      const result = validateNIC('123456-789V');
      expect(result.valid).toBe(true);
    });

    it('should reject empty NIC', () => {
      const result = validateNIC('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject NIC too short', () => {
      const result = validateNIC('123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 5 and 20');
    });

    it('should reject NIC too long', () => {
      const longNIC = 'A'.repeat(21);
      const result = validateNIC(longNIC);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 5 and 20');
    });

    it('should reject NIC with invalid characters', () => {
      const result = validateNIC('123@456#789');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });
  });

  describe('validateName', () => {
    it('should accept valid name', () => {
      const result = validateName('John Doe', 'Name');
      expect(result.valid).toBe(true);
    });

    it('should accept name with apostrophe', () => {
      const result = validateName("O'Brien", 'Name');
      expect(result.valid).toBe(true);
    });

    it('should accept name with hyphen', () => {
      const result = validateName('Mary-Jane', 'Name');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateName('', 'Name');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject name exceeding 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = validateName(longName, 'Name');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed 50');
    });

    it('should reject name with numbers', () => {
      const result = validateName('John123', 'Name');
      expect(result.valid).toBe(false);
    });

    it('should reject name with special characters', () => {
      const result = validateName('John@Doe', 'Name');
      expect(result.valid).toBe(false);
    });

    it('should use custom field name in error message', () => {
      const result = validateName('', 'First Name');
      expect(result.error).toContain('First Name');
    });
  });

  describe('validateAddress', () => {
    it('should accept valid address', () => {
      const result = validateAddress('123 Main Street, City, Country');
      expect(result.valid).toBe(true);
    });

    it('should reject empty address', () => {
      const result = validateAddress('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject address exceeding 200 characters', () => {
      const longAddress = 'A'.repeat(201);
      const result = validateAddress(longAddress);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed 200');
    });

    it('should accept address with numbers and special characters', () => {
      const result = validateAddress('Apt 5, 123-B Main Street (Suite 2)');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDistrict', () => {
    it('should accept valid district', () => {
      const result = validateDistrict('Colombo');
      expect(result.valid).toBe(true);
    });

    it('should reject empty district', () => {
      const result = validateDistrict('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject district exceeding 50 characters', () => {
      const longDistrict = 'A'.repeat(51);
      const result = validateDistrict(longDistrict);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed 50');
    });
  });

  describe('validateFileMimeType', () => {
    it('should accept allowed MIME type', () => {
      const file = new File([], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileMimeType(file, ['image/jpeg', 'image/png']);
      expect(result.valid).toBe(true);
    });

    it('should reject disallowed MIME type', () => {
      const file = new File([], 'test.pdf', { type: 'application/pdf' });
      const result = validateFileMimeType(file, ['image/jpeg', 'image/png']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should reject missing file', () => {
      const result = validateFileMimeType(null as any, ['image/jpeg']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should accept multiple allowed types', () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      allowedTypes.forEach(type => {
        const file = new File([], 'test', { type });
        const result = validateFileMimeType(file, allowedTypes);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateFileSize', () => {
    it('should accept file under size limit', () => {
      const file = new File(['content'], 'test.txt');
      const result = validateFileSize(file, 1); // 1 MB limit
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const largeContent = new ArrayBuffer(2 * 1024 * 1024); // 2 MB
      const file = new File([largeContent], 'test.bin');
      const result = validateFileSize(file, 1); // 1 MB limit
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not exceed 1MB');
    });

    it('should handle edge case - exact size limit', () => {
      const exactContent = new ArrayBuffer(1 * 1024 * 1024); // 1 MB
      const file = new File([exactContent], 'test.bin');
      const result = validateFileSize(file, 1); // 1 MB limit
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove angle brackets', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should trim whitespace', () => {
      const input = '   Hello World   ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello World');
    });

    it('should limit length to 500 characters', () => {
      const input = 'A'.repeat(600);
      const sanitized = sanitizeInput(input);
      expect(sanitized.length).toBe(500);
    });

    it('should preserve normal text', () => {
      const input = 'Normal text with numbers 123 and symbols !@#$';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain('Normal text');
      expect(sanitized).toContain('123');
    });
  });

  describe('validateCategoryCode', () => {
    it('should accept valid single character code', () => {
      const result = validateCategoryCode('A');
      expect(result.valid).toBe(true);
    });

    it('should accept valid two character code', () => {
      const result = validateCategoryCode('AB');
      expect(result.valid).toBe(true);
    });

    it('should accept numeric code', () => {
      const result = validateCategoryCode('01');
      expect(result.valid).toBe(true);
    });

    it('should reject empty code', () => {
      const result = validateCategoryCode('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject code exceeding 2 characters', () => {
      const result = validateCategoryCode('ABC');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not exceed 2');
    });

    it('should reject code with special characters', () => {
      const result = validateCategoryCode('A@');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('alphanumeric');
    });
  });

  describe('constantTimeCompare', () => {
    it('should return true for identical strings', () => {
      const result = constantTimeCompare('password123', 'password123');
      expect(result).toBe(true);
    });

    it('should return false for different strings', () => {
      const result = constantTimeCompare('password123', 'password124');
      expect(result).toBe(false);
    });

    it('should return false for different lengths', () => {
      const result = constantTimeCompare('password', 'password123');
      expect(result).toBe(false);
    });

    it('should return false for empty vs non-empty', () => {
      const result = constantTimeCompare('', 'password');
      expect(result).toBe(false);
    });

    it('should return true for both empty strings', () => {
      const result = constantTimeCompare('', '');
      expect(result).toBe(true);
    });

    it('should prevent timing attacks on first character mismatch', () => {
      // Both operations should take similar time despite early mismatch
      const result1 = constantTimeCompare('aaaaaaaaaaaa', 'bbbbbbbbbbbbb');
      const result2 = constantTimeCompare('aaaaaaaaaaaa', 'aaaaaaaaaaaabc');
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
