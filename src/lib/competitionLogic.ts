// Logic defined by the "Automated ID Generation Matrix" & "Age Validation Engine"

export type DivisionType = 'Junior' | 'Intermediate' | 'Senior' | 'Open';

export const VALID_YEARS: Record<string, number[]> = {
  Junior: [2011, 2012, 2013, 2014], // Grades 6-9
  Intermediate: [2009, 2010],       // Grades 10-11
  Senior: [2006, 2007, 2008],       // Grades 12-13
  Open: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014] // Grades 6-13
};

export const validateBirthYear = (dobString: string, division: string): { valid: boolean; error?: string } => {
  if (!dobString) return { valid: false, error: 'Date of birth is required' };
  
  const year = new Date(dobString).getFullYear();
  
  // Normalize division case
  const divKey = Object.keys(VALID_YEARS).find(k => k.toLowerCase() === division.toLowerCase());
  
  if (!divKey) return { valid: true }; // If division not found in rules, pass through (or strictly fail)

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