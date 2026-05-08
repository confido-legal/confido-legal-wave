import type { NextApiRequest, NextApiResponse } from 'next';

const mockFindUnique = jest.fn();
const mockCreate = jest.fn();

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      get findUnique() {
        return mockFindUnique;
      },
      get create() {
        return mockCreate;
      },
    },
  },
}));

jest.mock('cookies', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(),
  }));
});

function createMocks(body: any = {}) {
  const req = { method: 'POST', body } as NextApiRequest;
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, json, send } as unknown as NextApiResponse;
  return { req, res, status, json, send };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('POST /api/login', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (await import('@/pages/api/login')).default;
  });

  it('logs in with valid credentials', async () => {
    mockFindUnique.mockResolvedValue({
      id: 'u1',
      username: 'testuser',
      password: 'correctpass',
    });

    const { req, res, send } = createMocks({
      username: 'testuser',
      password: 'correctpass',
    });
    await handler(req, res);

    expect(send).toHaveBeenCalledWith(200);
  });

  it('returns 403 when user not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const { req, res, send } = createMocks({
      username: 'noone',
      password: 'pass',
    });
    await handler(req, res);

    expect(send).toHaveBeenCalledWith(403);
  });

  it('returns 403 when password is wrong', async () => {
    mockFindUnique.mockResolvedValue({
      id: 'u1',
      username: 'testuser',
      password: 'correctpass',
    });

    const { req, res, send } = createMocks({
      username: 'testuser',
      password: 'wrongpass',
    });
    await handler(req, res);

    expect(send).toHaveBeenCalledWith(403);
  });
});

describe('POST /api/signup', () => {
  let handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

  beforeEach(async () => {
    handler = (await import('@/pages/api/signup')).default;
  });

  it('creates user and returns safe user object (no password)', async () => {
    mockCreate.mockResolvedValue({
      id: 'u1',
      username: 'newuser',
      password: 'secret',
      firmId: 'f1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { req, res, status, json } = createMocks({
      username: 'newuser',
      password: 'secret',
      firmName: 'My Firm',
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(200);
    const returnedUser = json.mock.calls[0][0];
    expect(returnedUser.username).toBe('newuser');
    expect(returnedUser).not.toHaveProperty('password');
  });

  it('returns 400 when prisma throws (e.g. duplicate username)', async () => {
    mockCreate.mockRejectedValue(new Error('Unique constraint failed'));

    const { req, res, status, json } = createMocks({
      username: 'existing',
      password: 'pass',
      firmName: 'Firm',
    });
    await handler(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: 'Unique constraint failed',
    });
  });
});
