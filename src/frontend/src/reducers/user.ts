import { createContext } from 'react';
import { readCookie, setCookie } from '@/utils/cookie';
import { LANGUAGE } from '@/config/cookies';

declare type User = {
  username: string;
  email: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
};

const defaultContextValue = {} as UserContextType;

type UserState = {
  hasFetched: boolean;
  loggedIn: boolean;
  language: string;
  user: User | null;
};

type UserAction = {
  type: string;
  user?: User | null;
};

type UserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

export const initialUserState: UserState = {
  hasFetched: false,
  loggedIn: false,
  language: readCookie(LANGUAGE, 'en') || 'en',
  user: null
};

export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        hasFetched: true,
        loggedIn: !!action.user,
        language: readCookie(LANGUAGE, 'en') || 'en',
        user: action.user as User | null,
      };
    default:
      return state;
  }
};

export const setUser = (user: User | null) => ({
  type: 'SET_USER',
  user,
});
