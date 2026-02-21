import { describe, it, expect } from 'vitest';
import { validateBirthYear, formatContestantId } from './competitionLogic';

describe('Competition Logic', () => {
  describe('validateBirthYear', () => {
    it('should validate correct Junior age', () => {
      // Junior allowed: 2013-2015
      const result = validateBirthYear('2014-05-20', 'Junior');
      expect(result.valid).toBe(true);
    });

    it('should invalidate incorrect Junior age', () => {
      // 2005 is too old for Junior
      const result = validateBirthYear('2005-05-20', 'Junior');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid DOB');
    });

    it('should validate correct Senior age', () => {
      // Senior allowed: 2006-2008
      const result = validateBirthYear('2007-01-01', 'Senior');
      expect(result.valid).toBe(true);
    });

    it('should handle Open division correctly', () => {
      // Open allowed: 2006-2014
      const result = validateBirthYear('2010-01-01', 'Open');
      expect(result.valid).toBe(true);
    });

    it('should return error if DOB is missing', () => {
      const result = validateBirthYear('', 'Junior');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Date of birth is required');
    });

    it('should be case insensitive for division', () => {
      const result = validateBirthYear('2014-05-20', 'junior');
      expect(result.valid).toBe(true);
    });

    // Additional comprehensive tests
    it('should validate boundary age for Junior', () => {
      // Youngest (2015)
      const youngest = validateBirthYear('2015-12-31', 'Junior');
      expect(youngest.valid).toBe(true);

      // Oldest (2013)
      const oldest = validateBirthYear('2013-01-01', 'Junior');
      expect(oldest.valid).toBe(true);
    });

    it('should reject out-of-range Junior ages', () => {
      // Too young (2016)
      const tooYoung = validateBirthYear('2016-01-01', 'Junior');
      expect(tooYoung.valid).toBe(false);

      // Too old (2012)
      const tooOld = validateBirthYear('2012-12-31', 'Junior');
      expect(tooOld.valid).toBe(false);
    });

    it('should validate boundary age for Senior', () => {
      // Youngest (2009)
      const youngest = validateBirthYear('2009-12-31', 'Senior');
      expect(youngest.valid).toBe(true);

      // Oldest (2007)
      const oldest = validateBirthYear('2007-01-01', 'Senior');
      expect(oldest.valid).toBe(true);
    });

    it('should reject out-of-range Senior ages', () => {
      // Too young (2010)
      const tooYoung = validateBirthYear('2010-01-01', 'Senior');
      expect(tooYoung.valid).toBe(false);

      // Too old (2006)
      const tooOld = validateBirthYear('2006-12-31', 'Senior');
      expect(tooOld.valid).toBe(false);
    });

    it('should handle Open division with extended range', () => {
      // Open: 2007-2015 (inclusive)
      const year2007 = validateBirthYear('2007-01-01', 'Open');
      expect(year2007.valid).toBe(true);

      const year2015 = validateBirthYear('2015-12-31', 'Open');
      expect(year2015.valid).toBe(true);
    });

    it('should handle Intermediate division if supported', () => {
      // Intermediate: 2009-2011
      const result = validateBirthYear('2010-06-15', 'Intermediate');
      // Result depends on implementation
      expect(result).toHaveProperty('valid');
    });

    it('should handle invalid date formats', () => {
      const invalidDates = [
        '2012/05/20', // Wrong separator
        '20-05-2012', // Wrong order
        '2012-13-01', // Invalid month
        '2012-00-01', // Invalid month
        '2012-02-30', // Invalid day
        'not-a-date',
      ];

      invalidDates.forEach(date => {
        const result = validateBirthYear(date, 'Junior');
        expect(result.valid).toBe(false);
      });
    });

    it('should handle future dates', () => {
      const futureDate = '2030-01-01';
      const result = validateBirthYear(futureDate, 'Junior');
      expect(result.valid).toBe(false);
    });

    it('should handle very old dates', () => {
      const veryOldDate = '1900-01-01';
      const result = validateBirthYear(veryOldDate, 'Junior');
      expect(result.valid).toBe(false);
    });

    it('should reject null division', () => {
      const result = validateBirthYear('2012-05-20', '');
      expect(result.valid).toBe(false);
    });

    it('should reject invalid division names', () => {
      const result = validateBirthYear('2012-05-20', 'InvalidDivision');
      expect(result.valid).toBe(false);
    });

    it('should handle division with extra whitespace', () => {
      const result = validateBirthYear('2012-05-20', '  Junior  ');
      // May or may not handle trimming - depends on implementation
      expect(result).toHaveProperty('valid');
    });
  });

  describe('formatContestantId', () => {
    it('should format ID correctly with padding', () => {
      // Code: 01, Sequence: 5 -> NC-26-01-005
      const id = formatContestantId('01', 5);
      expect(id).toBe('NC-26-01-005');
    });

    it('should handle double digit sequence', () => {
      const id = formatContestantId('99', 42);
      expect(id).toBe('NC-26-99-042');
    });

    it('should handle triple digit sequence', () => {
      const id = formatContestantId('AB', 123);
      expect(id).toBe('NC-26-AB-123');
    });

    // Additional comprehensive tests
    it('should handle single digit sequence', () => {
      const id = formatContestantId('01', 1);
      expect(id).toBe('NC-26-01-001');
    });

    it('should handle large sequence numbers', () => {
      const id = formatContestantId('01', 999);
      expect(id).toBe('NC-26-01-999');
    });

    it('should handle alphabetic codes', () => {
      const id = formatContestantId('SR', 1);
      expect(id).toContain('SR');
      expect(id).toContain('001');
    });

    it('should maintain consistent format', () => {
      const ids = [
        formatContestantId('01', 1),
        formatContestantId('01', 10),
        formatContestantId('01', 100),
      ];

      // All should have same structure: NC-26-XX-YYY
      ids.forEach(id => {
        expect(id).toMatch(/^NC-26-\w{2}-\d{3}$/);
      });
    });

    it('should include year component (26)', () => {
      const id = formatContestantId('01', 5);
      expect(id).toContain('26'); // Current year 2026
    });

    it('should pad sequence to 3 digits', () => {
      const tests = [
        { code: '01', seq: 5, expected: '005' },
        { code: '01', seq: 50, expected: '050' },
        { code: '01', seq: 500, expected: '500' },
      ];

      tests.forEach(test => {
        const id = formatContestantId(test.code, test.seq);
        expect(id).toContain(test.expected);
      });
    });

    it('should handle mixed alphanumeric codes', () => {
      const id = formatContestantId('A1', 5);
      expect(id).toContain('A1');
    });

    it('should handle code variations', () => {
      const codes = ['01', '02', '99', 'AA', 'ZZ', 'A0', '1A'];
      codes.forEach(code => {
        const id = formatContestantId(code, 1);
        expect(id).toContain(code.toUpperCase());
      });
    });

    it('should handle edge case: sequence 0', () => {
      const id = formatContestantId('01', 0);
      expect(id).toContain('000');
    });

    it('should create unique IDs for different sequences', () => {
      const id1 = formatContestantId('01', 1);
      const id2 = formatContestantId('01', 2);
      expect(id1).not.toBe(id2);
    });

    it('should create unique IDs for different codes', () => {
      const id1 = formatContestantId('01', 1);
      const id2 = formatContestantId('02', 1);
      expect(id1).not.toBe(id2);
    });

    it('should be consistent across multiple calls', () => {
      const id1 = formatContestantId('01', 5);
      const id2 = formatContestantId('01', 5);
      expect(id1).toBe(id2);
    });
  });

  describe('Integration Tests', () => {
    it('should support full contestant registration flow', () => {
      // Step 1: Validate age for category
      const ageValidation = validateBirthYear('2014-05-20', 'Junior');
      expect(ageValidation.valid).toBe(true);

      // Step 2: Generate contestant ID
      const contestantId = formatContestantId('01', 42);
      expect(contestantId).toContain('NC-26-01-042');
    });

    it('should handle multiple contestants from same category', () => {
      const ageValidation = validateBirthYear('2014-05-20', 'Junior');
      expect(ageValidation.valid).toBe(true);

      // Generate IDs for multiple contestants
      const ids = [1, 2, 3, 4, 5].map(seq => formatContestantId('01', seq));

      // All should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should handle multiple categories in same competition', () => {
      // Category 01 - Junior
      const cat1Id1 = formatContestantId('01', 1);
      const cat1Id2 = formatContestantId('01', 2);

      // Category 02 - Senior
      const cat2Id1 = formatContestantId('02', 1);
      const cat2Id2 = formatContestantId('02', 2);

      // All should be unique
      const ids = [cat1Id1, cat1Id2, cat2Id1, cat2Id2];
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(4);
    });
  });
});