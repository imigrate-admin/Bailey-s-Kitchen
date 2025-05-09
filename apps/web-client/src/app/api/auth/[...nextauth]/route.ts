import NextAuth from 'next-auth';
import { authOptions } from '../auth.config';

// Export handler for API route
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

