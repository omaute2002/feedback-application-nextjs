"use client";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  // NOTE: Using Optimisitic UI building etechnique
  // used by facebook and instagram engineers
  // where they update the UI despite of checking if the backend response
  // or backend updated successfully or not
  // EXAMPLE: when we press like on the post of instagram
  // UI shows we have liked whether or not the LIke count updated in backedn or not
  // it will still shows the liked icon for the usr

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => {
        message._id !== messageId;
      })
    );
  };

  const { data: session } = useSession(); // getting the user data from the session
  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema),
  });
  const { register, watch, setValue } = form;
  // "Register"  used to register form inputs and apply validation rules. It connects the input fields to the form's state management system and validation.
  // "Watch"  This function is used to watch specific input values and return their current values
  // "setValue" Dynamic Updates: You can dynamically update form values in response to user actions or other state changes.
  // for default values as well 
  return (
    <>
      <div>Dashboard</div>
    </>
  );
};

export default page;
