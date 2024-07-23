"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";

const page = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier: '',
      password:''
    }
  })

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    // USING SIGN IN USING NEXT AUTH
    const result = await signIn('credentails', {
      identifier: data.identifier,
      password: data.password
    })
    console.log(result);
    
    if(result?.error){
      if(result.error = 'CredentialsSignin'){
        toast({
          title:"Login Failed",
          description:"Incorrect username or password",
          variant:"destructive"
        })
      }else{
            toast({
              title:"error",
              description:result.error,
              variant:"destructive"
            })
      }
      
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              EchoEnvelope
            </h1>
            <p className="mb-4">Sign In</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {/* {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )} */}
                Sign IN
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
                <p>Not a member?{' '}</p>
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                  Sign Up
                </Link>
        </div>
        </div>
      </div>
    </>
  );
};

export default page;
