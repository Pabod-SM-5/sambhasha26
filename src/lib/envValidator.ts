/**
 * Environment Configuration Validator
 * Ensures all required environment variables are set at startup
 */

interface RequiredEnv {
  name: string;
  description: string;
}

const requiredEnv: RequiredEnv[] = [
  {
    name: 'VITE_SUPABASE_URL',
    description: 'Supabase project URL'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key'
  }
];

export const validateEnvironment = (): void => {
  const missing: string[] = [];

  requiredEnv.forEach(({ name, description }) => {
    const value = (import.meta as any).env[name];
    if (!value) {
      missing.push(`${name} (${description})`);
    }
  });

  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables:\n${missing.map(m => `  - ${m}`).join('\n')}\n\nPlease check your .env file or deployment configuration.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

export default validateEnvironment;
