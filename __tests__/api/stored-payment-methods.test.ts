import type { NextApiRequest, NextApiResponse } from 'next';

const mockGetSessionFromRequestOrThrow = jest.fn();
const mockCreateSavePaymentMethodToken = jest.fn();
const mockCompleteSavePaymentMethod = jest.fn();

jest.mock('@/lib/session', () => ({
  getSessionFromRequestOrThrow: (...args: any[]) =>
    mockGetSessionFromRequestOrThrow(...args),
}));

jest.mock('@/confido-legal-requests', () => ({
  __esModule: true,
  default: {
    createSavePaymentMethodToken: (...args: any[]) =>
      mockCreateSavePaymentMethodToken(...args),
    completeSavePaymentMethod: (...args: any[]) =>
      mockCompleteSavePaymentMethod(...args),
  },
}));

function createMocks(options: { method?: string; body?: any } = {}) {
  const { method = 'GET', body = {} } = options;
  const req = { method, body } as NextApiRequest;
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, json } as unknown as NextApiResponse;
  return { req, res, status, json };
}

const authedSession = {
  user: {
    id: 'u1',
    firm: { id: 'f1', glApiToken: 'tok-123' },
  },
};

const noTokenSession = {
  user: {
    id: 'u1',
    firm: { id: 'f1', glApiToken: null },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/stored-payment-methods/create-token', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (
      await import('@/pages/api/stored-payment-methods/create-token')
    ).default;
  });

  it('returns token on success', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockCreateSavePaymentMethodToken.mockResolvedValue('spm-tok-456');

    const { req, res, status, json } = createMocks();
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ token: 'spm-tok-456' });
  });

  it('returns 400 when firm is not connected', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(noTokenSession);

    const { req, res, status, json } = createMocks();
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('not connected') })
    );
  });

  it('returns 500 when token creation throws', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockCreateSavePaymentMethodToken.mockRejectedValue(
      new Error('API unreachable')
    );

    const { req, res, status, json } = createMocks();
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'API unreachable' });
  });

  it('returns 500 when auth fails', async () => {
    mockGetSessionFromRequestOrThrow.mockRejectedValue(
      new Error('user not found')
    );

    const { req, res, status, json } = createMocks();
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'user not found' });
  });
});

describe('POST /api/stored-payment-methods/complete', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (
      await import('@/pages/api/stored-payment-methods/complete')
    ).default;
  });

  it('completes payment method save on success', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockCompleteSavePaymentMethod.mockResolvedValue({
      completeSavePaymentMethod: {
        id: 'spm-1',
        lastFour: '4242',
      },
    });

    const { req, res, status, json } = createMocks({
      method: 'POST',
      body: {
        clientName: 'John',
        email: 'john@test.com',
        token: 'spm-tok-456',
        paymentMethod: 'card',
      },
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ id: 'spm-1', lastFour: '4242' });
  });

  it('returns 400 when firm is not connected', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(noTokenSession);

    const { req, res, status, json } = createMocks({ method: 'POST' });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 500 on API failure', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockCompleteSavePaymentMethod.mockRejectedValue(
      new Error('save failed')
    );

    const { req, res, status, json } = createMocks({
      method: 'POST',
      body: { token: 't', paymentMethod: 'card' },
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'save failed' });
  });
});
