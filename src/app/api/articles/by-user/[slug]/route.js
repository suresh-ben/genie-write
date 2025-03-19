import mongoose from "mongoose";
import Article from "@/models/Article";
import { connectToDatabase } from "@/lib/mongodb";

export const GET = async (request, { params }) => {
    try {
        // Correct destructuring of params
        const { slug: userId } = await params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        await connectToDatabase();

        const articles = await Article.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(userId) }, // Convert string ID to ObjectId
            },
            {
                $lookup: {
                    from: "users", // MongoDB collection name for "User"
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author", // Convert array result to an object
            },
            {
                $project: {
                    slug: 1,
                    heading: 1,
                    article: 1,
                    thumbnail: 1,
                    likeCount: { $size: "$likes" },
                    dislikeCount: { $size: "$disLikes" },
                    createdAt: 1,
                    createdBy: "$author._id",
                    authorName: "$author.name",
                    authorImage: "$author.image",
                },
            },
        ]);

        return new Response(JSON.stringify({ articles }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
};
