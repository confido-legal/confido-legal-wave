import type { NextApiRequest, NextApiResponse } from 'next';

const mockGetSessionFromRequestOrThrow = jest.fn();
const mockPaymentSessionComplete = jest.fn();

jest.mock('@/lib/session', () => ({
  getSessionFromRequestOrThrow: (...args: any[]) =>
    mockGetSessionFromRequestOrThrow(...args),
}));

jest.mock('@/confido-legal-requests/paymentSessionComplete', () => ({
  paymentSessionComplete: (...args: any[]) =>
    mockPaymentSessionComplete(...args),
}));

function createMocks(body: any = {}) {
  const req = { method: 'POST', body } as NextApiRequest;
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
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('POST /api/complete-payment', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (await import('@/pages/api/complete-payment')).default;
  });

  it('completes payment successfully', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockPaymentSessionComplete.mockResolvedValue({
      paymentSessionComplete: { id: 'pay-1', status: 'completed' },
    });

    const { req, res, status, json } = createMocks({
      amount: '5000',
      email: 'test@test.com',
      paymentMethod: 'card',
      name: 'John',
      paymentToken: 'pt-123',
      savePaymentMethod: false,
      sendReceipt: true,
    });
    await handler(req, res);

    expect(mockPaymentSessionComplete).toHaveBeenCalledWith('tok-123', {
      amount: 5000,
      payerEmail: 'test@test.com',
      method: 'card',
      payerName: 'John',
      paymentSessionToken: 'pt-123',
      savePaymentMethod: false,
      sendReceipt: true,
    });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ id: 'pay-1', status: 'completed' });
  });

  it('returns 400 when firm is not connected', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(noTokenSession);

    const { req, res, status, json } = createMocks({ amount: '100' });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('not connected') })
    );
  });

  it('returns 500 when payment fails', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockPaymentSessionComplete.mockRejectedValue(
      new Error('insufficient funds')
    );

    const { req, res, status, json } = createMocks({
      amount: '100',
      paymentToken: 'pt-123',
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'insufficient funds' });
  });

  it('returns 500 when not authenticated', async () => {
    mockGetSessionFromRequestOrThrow.mockRejectedValue(
      new Error('user not found')
    );

    const { req, res, status, json } = createMocks({});
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'user not found' });
  });
});
