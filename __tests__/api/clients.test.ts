import type { NextApiRequest, NextApiResponse } from 'next';

const mockGetSessionFromRequestOrThrow = jest.fn();
const mockCreateClient = jest.fn();
const mockGetClient = jest.fn();
const mockGetFirm = jest.fn();

jest.mock('@/lib/session', () => ({
  getSessionFromRequestOrThrow: (...args: any[]) =>
    mockGetSessionFromRequestOrThrow(...args),
}));

jest.mock('@/confido-legal-requests/addClient', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

jest.mock('@/confido-legal-requests/getClient', () => ({
  getClient: (...args: any[]) => mockGetClient(...args),
}));

jest.mock('@/confido-legal-requests/getFirm', () => ({
  getFirm: (...args: any[]) => mockGetFirm(...args),
}));

function createMocks(options: { method?: string; body?: any } = {}) {
  const { method = 'POST', body = {} } = options;
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
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('POST /api/clients/add', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (await import('@/pages/api/clients/add')).default;
  });

  it('rejects non-POST methods', async () => {
    const { req, res, status, json } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(405);
    expect(json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 400 when firm is not connected', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(noTokenSession);
    const { req, res, status, json } = createMocks({
      body: { clientName: 'Test' },
    });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('not connected') })
    );
  });

  it('returns 400 when clientName is missing', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    const { req, res, status, json } = createMocks({ body: {} });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Client name is required.' });
  });

  it('returns 400 when clientName is whitespace', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    const { req, res, status, json } = createMocks({
      body: { clientName: '   ' },
    });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Client name is required.' });
  });

  it('creates a client successfully', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockGetFirm.mockResolvedValue({ id: 'gl-firm-1' });
    mockCreateClient.mockResolvedValue({
      id: 'client-1',
      clientName: 'Jane Doe',
    });

    const { req, res, status, json } = createMocks({
      body: { clientName: 'Jane Doe' },
    });
    await handler(req, res);

    expect(mockGetFirm).toHaveBeenCalledWith('tok-123');
    expect(mockCreateClient).toHaveBeenCalledWith(
      'tok-123',
      'Jane Doe',
      'gl-firm-1'
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      id: 'client-1',
      clientName: 'Jane Doe',
    });
  });

  it('returns 500 when createClient throws', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockGetFirm.mockResolvedValue({ id: 'gl-firm-1' });
    mockCreateClient.mockRejectedValue(new Error('GraphQL failed'));

    const { req, res, status, json } = createMocks({
      body: { clientName: 'Jane' },
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'GraphQL failed' });
  });
});

describe('POST /api/clients/get', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (await import('@/pages/api/clients/get')).default;
  });

  it('rejects non-POST methods', async () => {
    const { req, res, status, json } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(405);
  });

  it('returns 400 when firm is not connected', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(noTokenSession);
    const { req, res, status, json } = createMocks({
      body: { clientId: 'c1' },
    });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when clientId is missing', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    const { req, res, status, json } = createMocks({ body: {} });
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Client ID is required.' });
  });

  it('returns client on success', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockGetClient.mockResolvedValue({
      id: 'c1',
      clientName: 'John',
      email: 'john@test.com',
    });

    const { req, res, status, json } = createMocks({
      body: { clientId: 'c1' },
    });
    await handler(req, res);

    expect(mockGetClient).toHaveBeenCalledWith('tok-123', 'c1');
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'c1', clientName: 'John' })
    );
  });

  it('returns 500 when getClient throws', async () => {
    mockGetSessionFromRequestOrThrow.mockResolvedValue(authedSession);
    mockGetClient.mockRejectedValue(new Error('not found'));

    const { req, res, status, json } = createMocks({
      body: { clientId: 'c1' },
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'not found' });
  });
});
