//Follow route: get current id from getUserData, to follower user id from body
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

        // Get the user ID to follow from the request body
        const { userId } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (currentUser._id.toString() === userId) {
            return new Response(
                JSON.stringify({ message: "You cannot follow yourself" }),
                { status: 400 }
            );
        }

        // Find the user who is being followed
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        // Check if already following
        const isAlreadyFollowing = userToFollow.following.includes(
            currentUser._id
        );
        if (isAlreadyFollowing) {
            return new Response(
                JSON.stringify({ message: "Already following this user" }),
                { status: 400 }
            );
        }

        // Add current user to the "following" list
        await User.findByIdAndUpdate(currentUser._id, {
            $addToSet: { following: userId },
        });

        return new Response(
            JSON.stringify({ message: "User followed successfully" }),
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
