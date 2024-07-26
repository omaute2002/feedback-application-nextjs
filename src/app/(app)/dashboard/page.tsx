"use client";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useCallback } from "react";
import { Message, User } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/custom-components/MessageCard";
import Navbar from "@/components/custom-components/Navbar";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  // NOTE: Using Optimistic UI building technique
  // used by Facebook and Instagram engineers
  // where they update the UI despite checking if the backend response
  // or backend updated successfully or not
  // EXAMPLE: when we press like on a post on Instagram
  // UI shows we have liked whether or not the Like count updated in the backend or not
  // it will still show the liked icon for the user

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id !== messageId)
    );
  };

  const { data: session } = useSession();
  // getting the user data from the session
  // console.log(session?.user?.username); 
  
  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema),
  });
  const { register, watch, setValue } = form;
  // "Register" is used to register form inputs and apply validation rules. It connects the input fields to the form's state management system and validation.
  // "Watch" is used to watch specific input values and return their current values
  // "setValue" is used for dynamic updates of form values in response to user actions or other state changes.
  const acceptMessages = watch("acceptMessages");
  
  const fetchAcceptMessage = useCallback(async () => {
    //NOTE:
    // used to set the value of the switch button to accepting messages or not
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  // GET ALL MESSAGES
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
    // console.log(messages);
    
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // HANDLE SWITCH CHANGE
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages); // changing the value of acceptMessage to its opposite
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <>
        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
          Please Login
        </Link>
      </>
    );
  }

  const { username } = session.user as User;
  // have to create the URL of the USER message
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <>
    <Navbar />
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h2 className="text-lg font-semibold mb-2">Copy your Unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 ml-8">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages} // getting the value on or off
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "on" : "off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4 ml-10"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-10 w-4" />
        )}
      </Button>
      <div className="ml-10 mr-10 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          
          <p>No messages to display</p>
        )}
      </div>
    </>
  );
};

export default Page;
