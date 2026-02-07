import { API_BASE_URL } from '@/lib/constants';
import type {
  GetCooperationOptionsResponse,
  SubmitCooperationFormForIndividualRequest,
  SubmitCooperationFormForOrganizationRequest,
} from '@/types/cooperation';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch cooperation form options (reasons for interest)
export async function fetchCooperationOptions(): Promise<GetCooperationOptionsResponse> {
  try {
    const url = `${API_BASE_URL}/forms/watchlist`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `Failed to fetch cooperation options: ${response.statusText}, ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Gracefully handle the error - the hook will catch it and show appropriate UI
    // Don't log to console.error to avoid alarming users with unavailable endpoints
    if (error instanceof ApiError) {
      throw error;
    }
    // Return a structured error for better handling in the UI
    throw new ApiError('Unable to connect to the server. The service may be temporarily unavailable.');
  }
}

// Submit cooperation form for individual
export async function submitCooperationFormForIndividual(
  data: SubmitCooperationFormForIndividualRequest,
  captchaToken: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/forms/watchlist/individual/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-captcha-token': captchaToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 400) {
        // Check if it's a captcha error
        if (errorData.message?.toLowerCase().includes('captcha')) {
          throw new ApiError('Security verification failed. Please try again.', response.status);
        }
        throw new ApiError('Please check your information and try again.', response.status);
      }

      if (response.status === 429) {
        throw new ApiError(
          'Too many requests. Please wait a moment and try again.',
          response.status
        );
      }

      if (response.status >= 500) {
        throw new ApiError('Something went wrong. Please try again later.', response.status);
      }

      throw new ApiError(errorData.message || 'An unexpected error occurred.', response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unable to connect. Please check your internet connection.');
  }
}

// Submit cooperation form for organization
export async function submitCooperationFormForOrganization(
  data: SubmitCooperationFormForOrganizationRequest,
  captchaToken: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/forms/watchlist/organization/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-captcha-token': captchaToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 400) {
        // Check if it's a captcha error
        if (errorData.message?.toLowerCase().includes('captcha')) {
          throw new ApiError('Security verification failed. Please try again.', response.status);
        }
        throw new ApiError('Please check your information and try again.', response.status);
      }

      if (response.status === 429) {
        throw new ApiError(
          'Too many requests. Please wait a moment and try again.',
          response.status
        );
      }

      if (response.status >= 500) {
        throw new ApiError('Something went wrong. Please try again later.', response.status);
      }

      throw new ApiError(errorData.message || 'An unexpected error occurred.', response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unable to connect. Please check your internet connection.');
  }
}
