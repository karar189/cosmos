import { useQuery } from '@tanstack/react-query';
import { fetchCooperationOptions } from '@/lib/api/cooperation';
import type { SelectOption } from '@/components/forms/CooperationForm';

export function useCooperationOptions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchlist-options'],
    queryFn: fetchCooperationOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000, // 1 second between retries
    // Suppress error logging in console - we handle it in the UI
    meta: {
      errorMessage: 'Failed to load cooperation options',
    },
  });

  // Transform API response to form select options
  let options: SelectOption[] = [];

  if (isLoading) {
    options = [{ value: '', label: 'Loading options...' }];
  } else if (error) {
    options = [{ value: '', label: 'Failed to load options' }];
  } else if (data?.reasonsForInterest) {
    options = [
      { value: '', label: 'Select a reason...' },
      ...data.reasonsForInterest.map((reason) => ({
        value: reason.id,
        label: reason.reasonForInterest,
      })),
    ];
  } else {
    options = [{ value: '', label: 'Select a reason...' }];
  }

  return {
    options,
    isLoading,
    error: error ? 'Failed to load options. Please refresh the page.' : null,
  };
}
