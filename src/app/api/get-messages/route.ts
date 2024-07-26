import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  
  // NOTE: WHEN USING AGGREGATION PIPELINE IN MONGOOSE
  // WE MUST USE FOLLOWING METHOD TO GET THE USER ID WHICH IS
  // PRESENT IN THE MONGODB DOCUMENT BASED DATABASE

  const username = user.username;

    
  try {
    const foundUser = await UserModel.aggregate([
      // Each pipeline in one curly brackets
      { $match: { username: username } },

      // 2nd pipeline
      // note: here the messages are saved in the document in the form of array
      // export interface Message extends Document {
      // content: string;
      // createdAt: Date;
      // }

      // we want to change this format into the array of obecjts
      // which will have same user and id but different messaeges
      // so that we can sort and can perform different operations
      // {
      //     "_id" :1,
      //     "user": "exampleuer",
      //     'messages' :{
      //         "content": "Hello"
      //         "createdAt": "2021-01-01"
      //     }
      // }

      // unwind is the aggregation function that we will use for it
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      //grouping all the documents
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      // in above line all the seperate messages are sorted
      // based on the date, grouped together on the basis of _id
      // and pushed in the messages field
    ]);


    if(!foundUser || foundUser.length === 0){
        // return Response.json(
        //     {
        //       success: false,
        //       message: "user not found",
        //     },
        //     { status: 401 }
        //   );
        return new Response(
          JSON.stringify({
            success: false,
            messages: "user not found",
          }),
          { status: 401 }
        );
    }

    // return Response.json(
    //     {
    //       success: true,
    //       messages: user[0].messages,
    //     },
    //     { status: 200 }
    //   );
    return new Response(
      JSON.stringify({
        success: true,
        messages: foundUser[0].messages,
      }),
      { status: 200 }
    );



  } catch (error) {
    console.log("Error getting the user messages", error);

    return Response.json(
      {
        success: false,
        message: "error getting the messages of users",
      },
      { status: 500 }
    );
  }
}
