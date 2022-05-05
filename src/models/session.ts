// From session official example https://github.com/vvo/iron-session/tree/main/examples/next.js-typescript

import { IronSessionOptions } from 'iron-session';
import { User } from './user';

export const sessionOptions: IronSessionOptions = (() => {
  if (!process.browser && !process.env.SECRET_COOKIE_PASSWORD) {
    console.error('ERROR: Missing SECRET_COOKIE_PASSWORD environment variable, please follow the README.md');
  }

  return {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'iron-session/examples/next.js',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  };
})();

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}
