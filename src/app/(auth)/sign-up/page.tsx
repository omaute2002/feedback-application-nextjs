"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import {Loader2} from 'lucide-react'

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // loading of the submitting action
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // NOTE: For each user keystroke in username field
  // we want to check whether or not the username is avaiblable or not
  // so, in such a case there would be multiple backend API calls which will make the process slover
  // hence, using" debouncing technique"  to make those call faster and minimal
  // usigng useHook ts for the simplicity
  // debouncing is particularly useful for optimizing performance and improving the user experience in situations where
  //a function could be called repeatedly in a short amount of time

  // NOTE: We dont want it for each keystroke we want it to be slower
  // and give feedback of username availability after some point of time
  const debouncedUsername = useDebounceCallback(setUsername, 500);
  // We will be checking the debouncedusername with the backend api
  // not the actual username state variable
  const { toast } = useToast();
  const router = useRouter();

  // "zod Implementation"
  const form = useForm<z.infer<typeof signUpSchema>>({
    // this typescript injection is completly optional
    // but it will only insure that the given fields must be accoriding to the "signUpSchema"

    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking userrname"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  // "onSumbit" method

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Unsuccessful",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join EchoEnvelope
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure with EchoEnvelope
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                    test {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait
                
              </> : "Signup"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
                <p>Already a member?{' '}</p>
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign In
                </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
