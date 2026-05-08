import { getErrorMessage } from '@/lib/getErrorMessage';

describe('getErrorMessage', () => {
  it('returns a plain string directly', () => {
    expect(getErrorMessage('something broke')).toBe('something broke');
  });

  it('extracts message from a standard Error', () => {
    expect(getErrorMessage(new Error('std error'))).toBe('std error');
  });

  it('extracts message from an object with errorMessage', () => {
    expect(getErrorMessage({ errorMessage: 'alt error' })).toBe('alt error');
  });

  it('prefers .message over .errorMessage', () => {
    expect(
      getErrorMessage({ message: 'msg', errorMessage: 'errMsg' })
    ).toBe('msg');
  });

  it('extracts the first GraphQL error from response.errors', () => {
    const gqlError = {
      response: {
        errors: [{ message: 'no operating accounts exist' }],
      },
      message: 'GraphQL Error (Code: 500): ...',
    };
    expect(getErrorMessage(gqlError)).toBe('no operating accounts exist');
  });

  it('falls through to .message when response.errors is empty', () => {
    const err = {
      response: { errors: [] },
      message: 'fallback',
    };
    expect(getErrorMessage(err)).toBe('fallback');
  });

  it('falls through when response.errors[0] has no message', () => {
    const err = {
      response: { errors: [{ code: 123 }] },
      message: 'fallback msg',
    };
    expect(getErrorMessage(err)).toBe('fallback msg');
  });

  it('returns default for null', () => {
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
  });

  it('returns default for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
  });

  it('returns default for a number', () => {
    expect(getErrorMessage(42)).toBe('An unknown error occurred');
  });

  it('returns default for an empty object', () => {
    expect(getErrorMessage({})).toBe('An unknown error occurred');
  });
});
