/**
 * Automated ID Generation Matrix & Age Validation Engine
 * Ensures competitors are placed in correct divisions based on age
 * 
 * NOTE: These rules are hardcoded. To update:
 * 1. Modify VALID_YEARS below
 * 2. Update database seed data
 * 3. Notify admins of rule changes
 */

export type DivisionType = 'Junior' | 'Intermediate' | 'Senior' | 'Open';

export const VALID_YEARS: Record<string, number[]> = {
  Junior: [2013, 2014, 2015],       // Grades 6-8
  Intermediate: [2010, 2011, 2012], // Grades 9-11
  Senior: [2007, 2008, 2009],       // Grades 12-13
  Open: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015] // Grades 6-13
};

export const validateBirthYear = (dobString: string, division: string): { valid: boolean; error?: string } => {
  if (!dobString) return { valid: false, error: 'Date of birth is required' };
  
  if (!division || division.trim().length === 0) return { valid: false, error: 'Division is required' };
  
  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }
  
  const date = new Date(`${dobString}T00:00:00`);
  const year = date.getFullYear();
  
  // Check for valid date
  if (isNaN(year) || date.toString() === 'Invalid Date') {
    return { valid: false, error: 'Invalid date of birth' };
  }
  
  // Verify the parsed date matches the input (catches Feb 30, etc.)
  const [inputYear, inputMonth, inputDay] = dobString.split('-').map(Number);
  if (date.getFullYear() !== inputYear ||
      date.getMonth() + 1 !== inputMonth ||
      date.getDate() !== inputDay) {
    return { valid: false, error: 'Invalid date of birth' };
  }
  
  // Check if future date
  if (date > new Date()) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }
  
  // Normalize division case
  const divKey = Object.keys(VALID_YEARS).find(k => k.toLowerCase() === division.toLowerCase());
  
  if (!divKey) return { valid: false, error: `Invalid division: ${division}` };

  const allowedYears = VALID_YEARS[divKey];
  
  if (!allowedYears.includes(year)) {
    return { 
      valid: false, 
      error: `Invalid DOB for ${division} Division. Allowed years: ${allowedYears.join(', ')}` 
    };
  }

  return { valid: true };
};

export const formatContestantId = (categoryCode: string, sequenceNumber: number): string => {
  // NC: Organization
  // 26: Edition
  // XX: Category Code
  // YYY: Sequence (padded)
  const seq = sequenceNumber.toString().padStart(3, '0');
  return `NC-26-${categoryCode}-${seq}`;
};