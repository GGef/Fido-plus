const BASE_URL = import.meta.env.PROD
  ? 'https://plus.fido.ma/api'
  : '/api';

export const API_ENDPOINTS = {
  APPOINTMENTS: {
    SUBMIT: `${BASE_URL}/submit-appointment`
  }
} as const;
