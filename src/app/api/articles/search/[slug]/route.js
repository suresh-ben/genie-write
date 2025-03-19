import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/Article";

export const GET = async (request, { params }) => {
    try {
        const { slug: searchTerm } = params; // Get search term from params
        
        await connectToDatabase();
        const articles = await Article.aggregate([
            {
                $match: { heading: { $regex: searchTerm, $options: "i" } } // Case-insensitive match
            },
            {
                $lookup: {
                    from: "users", // MongoDB collection name for the "User" model
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: "$author" // Convert array result to an object
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
                    authorImage: "$author.image"
                }
            }
        ]);
        
        if (articles.length === 0) {
            return new Response(JSON.stringify({ message: "No articles found!" }), { status: 404 });
        }
        
        return new Response(JSON.stringify(articles), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
};
