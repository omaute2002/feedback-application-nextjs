import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//behind the scenes next-auth will generate HTML form
// for you having all the credentials that you habve mentioned
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentails",
      name: "Credentails",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      // function to handle authentication

      // NOTE: ONCE THE AUTHROIZE IS DONE NOW I CAN HAVE ALL THE USER INFORMATION
      // WIHTOUT REACHING TO THE DATABASE AGAIN AND AGAIN 
      // WE ARE EDITING THE ORIGINAL STRUCTURE OF JWT AND SESSION
      // AND ADDING ADDITIONAL INFORMATION LIKE ISVERIFIED, ISACCEPTIINGMESSAGE
      // SUCH ADDITIONAL FIELD
      async authorize(credentails: any): Promise<any> {
        // if you dont knwo the datatype which the functin
        // will give in return give the <any> type to tit
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentails.identifier },
              { username: credentails.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentails.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
            // TODO : In nextauth after dooing all the authenticatioj
            // we have to return the user just like we hae done line 42
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  // pages as per given the documents the pages routes are
  // by default /api/signup are like that only
  // the routes which i want to change from the bydefault versiojn
  // i will mention here
  callbacks: {
    // We have to modify 2 startegies which are
    // 1. session
    // 2. jwt
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session; // must return session
    },
    async jwt({ token, user }) {
      // ususally token stores only id of the user
      // we want to make token more powerfull with some additional
      // user information. Hence, it will reduce the load of bringing data from backend eachtime
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessages;
        token.username = user.username;
      }
      // now we can retrive almost all important things from token only

      return token; // must reutnr token otherwise throws error
    },
  },
  pages: {
    signIn: "/sign-in", // by giving this route all the control goes to
    // next auth. NextAuth will create a page of sign in on this route of the applicaiton
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // is most imp to gice the secret
};
