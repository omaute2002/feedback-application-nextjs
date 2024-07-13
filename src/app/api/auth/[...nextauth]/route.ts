import NextAuth from 'next-auth/next'
import {authOptions} from './options'

// CREATE HANDLER FUNCTION NAME HANDLER IS IMPORTANT 
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST }