import User from "@/models/User";
import getUserData from "@/utils/getUserData";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export const POST = async (request) => {
    try {
        await connectToDatabase();

        // Get the current authenticated user
        const currentUser = await getUserData();
        if (!currentUser) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        // Get the user ID to unfollow from the request body
        const { userId } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (currentUser._id.toString() === userId) {
            return new Response(
                JSON.stringify({ message: "You cannot unfollow yourself" }),
                { status: 400 }
            );
        }

        // Find the user who is being unfollowed
        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        // Check if the user is actually following
        const isFollowing = currentUser.following.includes(userId);
        if (!isFollowing) {
            return new Response(
                JSON.stringify({ message: "You are not following this user" }),
                { status: 400 }
            );
        }

        // Remove user from the "following" list
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: { following: userId },
        });

        return new Response(
            JSON.stringify({ message: "User unfollowed successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};
