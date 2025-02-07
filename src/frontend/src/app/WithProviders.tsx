import { useReducer } from 'react';
import { Provider } from 'react-redux';
import {store} from '../store';

import {
  UserContext,
  initialUserState,
  userReducer,
} from '../reducers/user';

const WithProviders = ({ children }: React.PropsWithChildren) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  return (
    <Provider store={store}>
      <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
          {children}
      </UserContext.Provider>
    </Provider>
  );
};

export default WithProviders;