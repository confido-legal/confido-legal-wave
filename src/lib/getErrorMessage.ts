export function getErrorMessage(e: unknown): string {
  if (typeof e === 'string') {
    return e;
  }

  if (_isObject(e)) {
    if ('response' in e && _isObject(e.response)) {
      const resp = e.response;
      if ('errors' in resp && Array.isArray(resp.errors) && resp.errors.length > 0) {
        const firstError = resp.errors[0];
        if (_isObject(firstError) && typeof firstError.message === 'string') {
          return firstError.message;
        }
      }
    }
    if ('message' in e && typeof e.message === 'string') {
      return e.message;
    }
    if ('errorMessage' in e && typeof e.errorMessage === 'string') {
      return e.errorMessage;
    }
  }

  return 'An unknown error occurred';
}

function _isObject(e: unknown): e is Record<string, any> {
  return typeof e === 'object' && e !== null;
}
