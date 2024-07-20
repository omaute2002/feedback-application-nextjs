"use client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Loader2} from 'lucide-react'

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('')

  // <{username: string}> this is nothing but the typescript not necessay
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setVerifyMessage(response.data.message)
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>; // <ApiResponse> is Typescript nothing else
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
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="verify code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isSubmitting ? <>
                    <Loader2  className="mr-2 h-4 w-4 animate-spin"/>
                    Verifying
                </> : "Verify" }
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VerifyAccount;
