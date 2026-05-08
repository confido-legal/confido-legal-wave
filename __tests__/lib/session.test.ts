import {
  getSessionFromRequest,
  getSessionFromRequestOrThrow,
  requireAuth,
  withSession,
} from '@/lib/session';
import type { GetServerSidePropsContext } from 'next';

const mockFindUnique = jest.fn();

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      get findUnique() {
        return mockFindUnique;
      },
    },
  },
}));

jest.mock('@/confido-legal-requests/getFirm', () => ({
  getFirm: jest.fn(),
}));

function mockRequest(userId?: string) {
  return {
    cookies: userId ? { 'wave:userId': userId } : {},
  } as any;
}

function mockContext(userId?: string): GetServerSidePropsContext {
  return {
    req: mockRequest(userId),
    res: {} as any,
    query: {},
    resolvedUrl: '/',
  } as any;
}

const mockUser = {
  id: 'user-1',
  username: 'testuser',
  password: 'pass',
  firmId: 'firm-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  firm: {
    id: 'firm-1',
    name: 'Test Firm',
    glApiToken: 'tok-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getSessionFromRequest', () => {
  it('returns null user when no userId cookie', async () => {
    const session = await getSessionFromRequest(mockRequest());
    expect(session.user).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns user when cookie is present and user exists', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const session = await getSessionFromRequest(mockRequest('user-1'));
    expect(session.user).toEqual(mockUser);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { firm: true },
    });
  });

  it('returns null user when cookie is present but user not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const session = await getSessionFromRequest(mockRequest('nonexistent'));
    expect(session.user).toBeNull();
  });
});

describe('getSessionFromRequestOrThrow', () => {
  it('returns session when user exists', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const session = await getSessionFromRequestOrThrow(mockRequest('user-1'));
    expect(session.user).toEqual(mockUser);
  });

  it('throws when no user', async () => {
    await expect(
      getSessionFromRequestOrThrow(mockRequest())
    ).rejects.toThrow('user not found');
  });
});

describe('requireAuth', () => {
  it('redirects to /signup when not authenticated', async () => {
    mockFindUnique.mockResolvedValue(null);
    const gssp = requireAuth();
    const result = await gssp(mockContext());
    expect(result).toEqual({
      redirect: { destination: '/signup', permanent: false },
    });
  });

  it('returns serialized session when authenticated and no callback', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const gssp = requireAuth();
    const result = (await gssp(mockContext('user-1'))) as any;

    expect(result.props.session.user.id).toBe('user-1');
    expect(typeof result.props.session.user.createdAt).toBe('string');
  });

  it('calls custom getServerSideProps when provided', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const customGssp = jest.fn().mockResolvedValue({
      props: { custom: true },
    });
    const gssp = requireAuth(customGssp);
    const result = (await gssp(mockContext('user-1'))) as any;

    expect(customGssp).toHaveBeenCalled();
    expect(result.props.custom).toBe(true);
  });
});

describe('withSession', () => {
  it('returns serialized session when no callback', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const gssp = withSession();
    const result = (await gssp(mockContext('user-1'))) as any;

    expect(result.props.session.user.id).toBe('user-1');
    expect(typeof result.props.session.user.createdAt).toBe('string');
  });

  it('passes session in context to callback', async () => {
    mockFindUnique.mockResolvedValue(mockUser);
    const callback = jest.fn().mockResolvedValue({ props: { ok: true } });
    const gssp = withSession(callback);
    await gssp(mockContext('user-1'));

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({
          user: expect.objectContaining({ id: 'user-1' }),
        }),
      })
    );
  });
});
