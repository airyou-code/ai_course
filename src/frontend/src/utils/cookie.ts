import Cookies from 'js-cookie';

export function readCookie(name: string, defaultValue?: string) {
  const val = Cookies.get(name);
  return val === undefined ? defaultValue : val;
}

export function setCookie(name: string, value: string, expires: number | null = null) {
  if (expires) {
    Cookies.set(name, value, { expires });
  } else {
    Cookies.set(name, value);
  }
}

export function removeCookie(name: string) {
  Cookies.remove(name);
}
