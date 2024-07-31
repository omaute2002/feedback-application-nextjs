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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { Loader2 } from "lucide-react";

const page = () => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentResponse, setContentResponse] = useState("");
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const { username } = useParams();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
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

  const suggestMessage = async () => {
    // get request
    setGeneratingMessage(true);
    try {
      const response = await axios.get("/api/suggest-messages");
      console.log(response.data);
      const suggestMessageResponse = response.data.suggestedMessages;
      const cleanedString = suggestMessageResponse.replace(/^"|"$/g, '').trim();

      const messageArray = cleanedString.split(' || ').map(question => question.trim());
      
      // messageArray[0].slice(1);
      // messageArray[messageArray.length-1].slice(0,-1)
      // Clean up the last element if it contains an extra quote
      // if (messageArray.length > 0) {
      //   const lastIndex = messageArray.length - 1;
      //   messageArray[lastIndex] = messageArray[lastIndex].replace(
      //     /\\\"|\"$/,
      //     ""
      //   ); // Remove trailing \ or extra "

      //   // Optionally, clean up leading and trailing whitespace
      //   messageArray[lastIndex] = messageArray[lastIndex].trim();
      // }
      // messageArray.pop();
      console.log(messageArray)
      setSuggestedMessages(messageArray);
      // console.log(suggestedMessages);
    } catch (error) {
      console.error("Error while generating messages", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Unsuccessfull",
        description: errorMessage,
        variant: "destructive",
      });
      setGeneratingMessage(false);
    }
    setGeneratingMessage(false);
  };

  if (suggestedMessages.length > 0) {
    for(let i =0;i<suggestedMessages.length;i++){
      console.log(suggestedMessages[i])
    }
    
  }

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Public Profile Link
          </h1>
        </section>
      </main>
      <div className="ml-44 mr-44 text-white">
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
                      className="h-16"
                      placeholder="Write your anonymous message here"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setContent(e.target.value);
                      }}
                    />
                  </FormControl>
                  {content.length <= 10 ? (
                    <>
                      <p className="text-red-500">
                        Message should be atleast 10 characters long
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                className="justify-center bg-blue-600"
                type="submit"
                disabled={isSubmitting || content.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please wait
                    </Loader2>
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="suggest-message mt-16">
          <Button type="submit"  className="bg-blue-600 hover:bg-blue-500" onClick={suggestMessage}>
            {generatingMessage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin">
                  Please wait
                </Loader2>
              </>
            ) : (
              "Suggest Message"
            )}
          </Button>
        </div>
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {suggestedMessages.length > 0 ? (
                suggestedMessages.map(( message) => (
                  <Card  className="mt-4 mb-4">
                    <CardContent className="mt-6">{message}</CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <Card className="mt-4 mb-4">
                    <CardContent className="mt-6">
                      suggested message will appear here
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default page;

// Card className="mt-4 mb-4">
//                 <CardContent className="mt-6">
//                   Hello this is suggested message
//                 </CardContent>
//               </Card>
//               <Card className="mt-4 mb-4">
//                 <CardContent className="mt-6">
//                   Hello this is suggested message
//                 </CardContent>
//               </Card>
//               <Card className="mt-4 mb-4">
//                 <CardContent className="mt-6">
//                   Hello this is suggested message
//                 </CardContent>
//               </Card>
