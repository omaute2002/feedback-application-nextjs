import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
// NExt js gives this get method to get the informatuon about the session
// We also need authOptions from the nextAUth configuration that we done
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
// it will provide the user information


// POST REQUEST TO TOGGLE isAcceptingMessages 
export async function POST(request: Request){
    await dbConnect();


    const session = await getServerSession(authOptions) // getServerSession needs auth
    // options without authOptions it doesnt get the user information
    // NOTE: we have already saved all the user information in the 
    // session 
    const user: User = session?.user; // this will provide the typesafty the :USER 
    if(!session || !session.user){
        return Response.json({
            success: false,
            message:"Not Authenticated"
        }, {status:401})
    }

    const userId = user._id
    const {acceptMessages} = await request.json() 

    // now updating the user field of isAcceptingMessages
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true} // this will give the updated value of the user 
            // which will be saved in const 'updatedUser'

        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept message"
            },{status: 401})
        }
        return Response.json({
            success:true,
            message:"user accepting messages status updated successfully",
            updatedUser // also sending updated user
        },{status: 200})

    }   catch (error) {
        console.log("failed to update user status to accept messages", error)
        return Response.json({
            sucess:false,
            message:"failed to update user status to accept messages"
        }, {
            status: 500
        })
    }
}


// GET REQUEST 
export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user;
    console.log("user:",user);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authentcated"
        },{status:401})
    }
    const userId = user._id;
   try {
    const foundUser = await UserModel.findById(userId);
     console.log("founduser: ",foundUser)
    if(!foundUser){
        return Response.json({
            success: false,
            message: "user not found"
        },{status:404})
    }

    return Response.json({
        success:true,
        isAcceptingMessages : foundUser.isAcceptingMessage
    },{status:200})
   } catch (error) {
    console.log("Error getting the user information", error)
    return Response.json({
        success:false,
        message:"error in getting message acceptance status "
    },{status:500})
   }
}