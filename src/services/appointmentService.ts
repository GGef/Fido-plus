import { API_ENDPOINTS } from '../config/api';

export interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  message?: string;
  preferredContact?: string;
}

export const appointmentService = {
  async submitAppointment(data: AppointmentData) {
    const response = await fetch(API_ENDPOINTS.APPOINTMENTS.SUBMIT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de la soumission du rendez-vous');
    }

    return response.json();
  },
};
