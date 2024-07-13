import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

// using simple GET method to check whether the given
// username is unique nad valid according to the schema
// While user is signing up we are already checking all
// username unique ness email alredy exists or not
// but if we want to show whther the username exists or not in realtime
// while user is typing the username is the field  we need something fast

export async function GET(request: Request) {
  // Checking the type of request 
  // when someone mistakenly gives the post request to this route

//NOTE: NO need for such edge conditon in NEXTJS new version 

  //   if(request.method !== "GET"){
//     return Response.json({
//         success:false,
//         message:"Choose GET method to use this route"
//     }, {status: 405})
//   }
  
    await dbConnect();

  try {
    // getting username from the query URL
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // Validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); //TODO: remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters",
      });
    }

    const { username } = result.data; // username is presend in result.data
    // tjhis knowlefge comes when we console log the result while tesing

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
    if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status: 400})
    }else{
        return Response.json({
            success: true,
            message:"Username is available"
        }, {status:200})
    }
    
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
