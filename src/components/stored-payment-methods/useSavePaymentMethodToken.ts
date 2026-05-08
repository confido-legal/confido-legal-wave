import { useEffect, useState } from 'react';

export interface UseSavePaymentMethodTokenHook {
  error: any | undefined;
  loading: boolean;
  token: string | undefined;
}

export const useSavePaymentMethodToken = (): UseSavePaymentMethodTokenHook => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<Error>();

  const fetchAndSaveToken = async () => {
    try {
      const result = await fetch('/api/stored-payment-methods/create-token');
      const json = await result.json();

      if (!result.ok) {
        setError(new Error(json.error || `Failed to create token (${result.status})`));
        return;
      }

      setToken(json.token);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSaveToken();
  }, []);

  return {
    error,
    loading,
    token,
  };
};
