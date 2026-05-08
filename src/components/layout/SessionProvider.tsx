import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface Session {
  user?: {
    id: string;
    firmId: string;
    name: string;
    username: string;
  };
  firm?: {
    id: string;
    name: string;
  };
  glFirm?: {
    id: string;
    isAcceptingPayments: boolean;
    name: string;
  };
}

const SessionContext = createContext<Session>({});

export const useSession = () => {
  return useContext(SessionContext);
};

const SessionProvider: FC<PropsWithChildren> = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState({});

  const fetchAndSetSession = async () => {
    const response = await fetch('/api/session');
    const session = await response.json();
    setSession(session);
    setLoaded(true);
  };

  useEffect(() => {
    fetchAndSetSession();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {loaded && props.children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
