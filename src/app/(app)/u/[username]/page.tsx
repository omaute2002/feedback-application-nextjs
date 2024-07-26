"use client";
import react from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { Loader2 } from "lucide-react";

const page = () => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentResponse, setContentResponse] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const { username } = useParams();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content:"",
    },
  });
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      const response = await axios.post("/api/send-message", {
        data,
        username,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error while sending the message", error);
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

  // GET REQUEST TO SUGGEST MESSAGE
  const getRequest = async () => {
    setIsSubmitting(true);
    try {
    } catch (error) {}
  };

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Public Profile Link
          </h1>
          
        </section>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your anonymous message here"
                        {...field}
                        onChange={(e)=>{
                            field.onChange(e)
                            setContent(e.target.value)
                        }}
                      />
                    </FormControl>
                   {content.length <=10 ? (<>
                    <p className="text-red-500">Message should be atleast 10 characters long</p>
                   </>) : (<></>)}
                    <FormMessage />

                  </FormItem>
                )}

              />
              <Button type="submit" disabled={isSubmitting || content.length === 0}>
                {
                    isSubmitting ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                        Please wait
                    </Loader2>
                    </> : "Send Message"
                }
              </Button>
            </form>
          </Form>
      </main>
    </>
  );
};

export default page;
