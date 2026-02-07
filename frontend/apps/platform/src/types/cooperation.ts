// API Response Types
export interface ReasonForInterest {
  id: string;
  reasonForInterest: string;
}

export interface GetCooperationOptionsResponse {
  reasonsForInterest: ReasonForInterest[];
}

// API Request Types
export interface SubmitCooperationFormForIndividualRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface SubmitCooperationFormForOrganizationRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  reasonForInterest: string;
  reasonForInterestComment?: string | null;
}

// Form Data Types
export type CooperationFormData = {
  role: 'individual' | 'organization';
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  reasonForInterest?: string;
  reasonForInterestComment?: string;
  agreeToTerms: boolean;
};

// Error Types
export interface ApiError {
  message: string;
  statusCode?: number;
}
