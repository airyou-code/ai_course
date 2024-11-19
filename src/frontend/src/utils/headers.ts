import { readCookie } from './cookie';
import { ACCESS_TOKEN } from '../config/cookies';
import { CSRF_TOKEN } from '../config/cookies';

export function getHeders() {
    return {
        'Content-Type': 'application/json',
        'X-CSRFToken': readCookie(CSRF_TOKEN, ''),
        'Authorization': `Bearer ${readCookie(ACCESS_TOKEN, '')}`
    }
}
