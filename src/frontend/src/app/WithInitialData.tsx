import { useEffect, useState } from 'react';
import { readCookie } from '../utils/cookie';
import { REFRESH_TOKEN } from '../config/cookies';
import { useFetchUserData } from '../hooks/user';

const WithInitialData = ({ children }: React.PropsWithChildren) => {
  const fetchUserData = useFetchUserData();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (readCookie(REFRESH_TOKEN, '')) {
      fetchUserData().finally(() => setHasFetched(true));
    } else {
      setHasFetched(true);
    }
  }, [fetchUserData]);

  if (!hasFetched) {
    return null;
  }

  return children;
};

export default WithInitialData;