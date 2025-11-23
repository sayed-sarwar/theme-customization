const isDev = import.meta.env.DEV;
const isStaging = import.meta.env.MODE === 'staging';
const isProd = import.meta.env.PROD;

export const env = {
  MODE: import.meta.env.MODE,
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ERP System',
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'default-secret',
  TOKEN_EXPIRY: import.meta.env.VITE_TOKEN_EXPIRY || '24h',
  isDev,
  isStaging,
  isProd
};