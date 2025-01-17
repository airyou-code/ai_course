import { useReducer } from 'react';

import {
  UserContext,
  initialUserState,
  userReducer,
} from '../reducers/user';

const WithProviders = ({ children }: React.PropsWithChildren) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
        {children}
    </UserContext.Provider>
  );
};

export default WithProviders;