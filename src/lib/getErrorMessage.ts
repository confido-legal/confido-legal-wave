export function getErrorMessage(e: unknown): string {
  if (typeof e === 'string') {
    return e;
  }

  if (_isObject(e)) {
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
