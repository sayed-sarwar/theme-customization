import enLocale from '../locales/en.json';

type ErrorKey = keyof typeof enLocale.errors;

export const getErrorMessage = (key: ErrorKey): string => {
  return enLocale.errors[key] || 'Unknown error';
};

export const ERROR_KEYS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS' as const,
  NETWORK_ERROR: 'NETWORK_ERROR' as const,
  UNAUTHORIZED: 'UNAUTHORIZED' as const,
  SERVER_ERROR: 'SERVER_ERROR' as const
};