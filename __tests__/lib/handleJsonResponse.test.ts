import { handleJsonResponse } from '@/lib/handleJsonResponse';

function mockResponse(
  body: any,
  options: { ok?: boolean; status?: number; statusText?: string } = {}
): Response {
  const { ok = true, status = 200, statusText = 'OK' } = options;
  return {
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
  } as Response;
}

function mockResponseBadJson(
  options: { status?: number; statusText?: string } = {}
): Response {
  const { status = 500, statusText = 'Internal Server Error' } = options;
  return {
    ok: false,
    status,
    statusText,
    json: () => Promise.reject(new SyntaxError('Unexpected token')),
  } as Response;
}

describe('handleJsonResponse', () => {
  it('returns parsed JSON when response is ok', async () => {
    const resp = mockResponse({ data: 'hello' });
    const result = await handleJsonResponse<{ data: string }>(resp);
    expect(result).toEqual({ data: 'hello' });
  });

  it('throws with json.error when response is not ok and body has error field', async () => {
    const resp = mockResponse(
      { error: 'bad input' },
      { ok: false, status: 400, statusText: 'Bad Request' }
    );

    await expect(handleJsonResponse(resp)).rejects.toEqual({
      message: 'bad input',
      status: 400,
    });
  });

  it('throws with statusText when response is not ok and body has no error field', async () => {
    const resp = mockResponse(
      {},
      { ok: false, status: 404, statusText: 'Not Found' }
    );

    await expect(handleJsonResponse(resp)).rejects.toEqual({
      message: 'Not Found',
      status: 404,
    });
  });

  it('throws when response.json() rejects (invalid JSON)', async () => {
    const resp = mockResponseBadJson({ status: 500 });

    await expect(handleJsonResponse(resp)).rejects.toEqual({
      message: 'Unexpected token',
      status: 500,
    });
  });
});
