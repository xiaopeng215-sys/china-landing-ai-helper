import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      avatar?: string;
      provider?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    avatar?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    avatar?: string;
    provider?: string;
  }
}
