import Article from "@/models/Article";
import { connectToDatabase } from "@/lib/mongodb";
import getUserData from "@/utils/getUserData";

export const GET = async (request) => {
    try {
        await connectToDatabase();
        const user = await getUserData();

        if (!user)
            return new Response(JSON.stringify({ message: "UnAuthorized" }), {
                status: 401,
            });

        const articles = await Article.aggregate([
            {
                $match: {
                    createdBy: { $ne: user._id },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: "users", // MongoDB collection name for the "User" model
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
                    interactionCount: 1,
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
        return new Response(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};
