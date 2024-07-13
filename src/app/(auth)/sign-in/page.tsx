'use client'
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
// NOTE: This file is in the (auth) folder 
// due to the paranthesis the route would not contain /auth in that 
// it will directly have /sign-in which the folder name that is inside the (auth)



function page() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );  
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 px-3 py-1" onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default page;
 