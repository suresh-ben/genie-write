import Article from "@/models/Article";
import { connectToDatabase } from "@/lib/mongodb";
import getUserData from "@/utils/getUserData";

export const GET = async (request) => {
    try {
        await connectToDatabase();

        // Get the logged-in user
        const user = await getUserData();
        if (!user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        // Find the articles created by the users the current user follows
        const articles = await Article.aggregate([
            {
                $match: {
                    createdBy: { $in: user.following }, // Filter by followed users
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author",
            },
            {
                $project: {
                    slug: 1,
                    heading: 1,
                    thumbnail: 1,
                    createdAt: 1,
                    likeCount: { $size: "$likes" },
                    dislikeCount: { $size: "$disLikes" },
                    createdBy: "$author._id",
                    authorName: "$author.name",
                    authorImage: "$author.image",
                },
            },
            {
                $sort: { createdAt: -1 }, // Sort by latest articles
            },
        ]);

        return new Response(JSON.stringify({ articles }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};
