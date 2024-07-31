"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button"
import {X} from "lucide-react"
import {Message} from "@/model/User"
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "../ui/use-toast";
import axios from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
type MessageCardProps ={
    message: Message;
    onMessageDelete: (messageId: string) => void 
}



// NOTE: "onMessageDelete" will get the message._id so that after 
// succesfull deletion of the message the parent dashboard UI component
// will remove that message with the message._id that is passed in the function args

export const MessageCard = ({key ,message, onMessageDelete}) => {

    const {toast} = useToast();
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title:response.data.message,

        })
        onMessageDelete(message._id);
    }


  return (
    <>
      <div>
        <Card className="h-40 w-auto">
          <CardHeader>
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-11 mt-6  justify-center" variant="destructive"><X /></Button>
              </AlertDialogTrigger> 
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};
