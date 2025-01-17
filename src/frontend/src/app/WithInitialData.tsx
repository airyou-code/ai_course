import { useFetchUserData } from "../hooks/user";
import { readCookie } from "../utils/cookie";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config/cookies';
import { useUserState } from "../hooks/user";
import { useEffect } from "react";


const WithInitialData = ({ children }: React.PropsWithChildren) => {

  const { hasFetched } = useUserState();
  const fetchUserData = useFetchUserData();

  useEffect(() => {
    if (readCookie(REFRESH_TOKEN, '')) {
      fetchUserData();
    }
  }, [fetchUserData]);

  if (!hasFetched) {
    return null;
  }

  return children;
};

export default WithInitialData;