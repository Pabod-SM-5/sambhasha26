import { describe, it, expect } from 'vitest';
import { validateBirthYear, formatContestantId } from './competitionLogic';

describe('Competition Logic', () => {
  describe('validateBirthYear', () => {
    it('should validate correct Junior age', () => {
      // Junior allowed: 2011-2014
      const result = validateBirthYear('2012-05-20', 'Junior');
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
      const result = validateBirthYear('2012-05-20', 'junior');
      expect(result.valid).toBe(true);
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
  });
});