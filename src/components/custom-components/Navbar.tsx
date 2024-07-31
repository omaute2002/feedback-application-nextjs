"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth"; // all the session data is in the USER
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="p-2 md:p-6 shadow-md  bg-slate-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">EchoEnvelope</a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button className="2-full md:w-auto  bg-blue-600  hover:bg-blue-500" onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white pl-10 pr-10">Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
