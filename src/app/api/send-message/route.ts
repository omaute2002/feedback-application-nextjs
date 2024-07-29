import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User"


// route to send messages to the user
export async function POST(request: Request){
    await dbConnect()

    const {username, data}=await request.json()
    // console.log(username);
    const content = data.content
    // console.log("content: ",content)
    try {   
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            }, {status:404})
        }
        // is user accepting the messages?
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user not accepting messages"
            }, {status:403})
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message:"Message send successfully"
        }, {status : 200})

    } catch (error) {
        console.log('An unexpected error occured', error);
        
        return Response.json({
            success: false,
            message: "error while sending the messages "
        },{status: 500})
    }
}
