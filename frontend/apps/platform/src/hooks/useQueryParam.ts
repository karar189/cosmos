import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface UseQueryParamOptions<T extends string = string> {
  /** Query parameter key name */
  key: string;
  /** Default value when query param is not present */
  defaultValue: T;
  /** List of valid values. If provided, invalid query values will fallback to default */
  validValues?: T[];
}

interface UseQueryParamResult<T extends string = string> {
  /** Current param value */
  value: T;
  /** Function to update the param value and URL */
  setValue: (value: T) => void;
}

/**
 * Hook to sync state with URL query parameters.
 * Reads param value from URL on mount, falls back to default if not present.
 * Updates URL query params when value changes.
 */
export function useQueryParam<T extends string = string>({
  key,
  defaultValue,
  validValues,
}: UseQueryParamOptions<T>): UseQueryParamResult<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const queryValue = searchParams.get(key);

    if (!queryValue) {
      return defaultValue;
    }

    // If validValues provided, validate the query value
    if (validValues && !validValues.includes(queryValue as T)) {
      return defaultValue;
    }

    return queryValue as T;
  }, [searchParams, key, defaultValue, validValues]);

  const setValue = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newValue === defaultValue) {
        // Remove query param if setting to default value (cleaner URLs)
        params.delete(key);
      } else {
        params.set(key, newValue);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams, key, defaultValue]
  );

  return { value, setValue };
}

export default useQueryParam;
