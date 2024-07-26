
import { User } from "@/model/User";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  response:Response,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
     Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );

    try {
      const updateResult = await UserModel.updateOne(
        { _id: user._id },
        { $pull: { messages: { _id: messageId } } }
      );
      if(updateResult.modifiedCount === 0){
        return Response.json({
            success: false,
            message:"Message not found or already deleted"
        },{status: 404})
      }

      return Response.json({
        success: true,
        message: "Message deleted successfully"
      },{status: 200})
    } catch (error) {
        console.log("Facing error in deleting message", error );
        
        return Response.json({
            success: false,
            message:"Error in deleting the message"
        },{status: 500})
    }
  }
}
