import { connectToDatabase } from "@/lib/mongodb";
import Article from "@/models/Article"

export const GET = async (request, { params }) => {
    try {
        const { slug: articleSlug } = await params;

        await connectToDatabase();
        const articles = await Article.aggregate([
            {
                $match: { slug: articleSlug } // Filter by slug
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
                    likes: 1,
                    disLikes: 1,
                    likeCount: { $size: "$likes" },
                    dislikeCount: { $size: "$disLikes" },
                    createdAt: 1,
                    createdBy: "$author._id",
                    authorName: "$author.name",
                    authorImage: "$author.image"
                }
            }
        ]);
        if(!articles[0]) {
            return new Response({ message: "No article found!" }, { status: 404 })
        }

        return new Response(JSON.stringify(articles[0]), { status: 200 })
    } catch (error) {
        return new Response({ message: "Something went wrong!" }, { status: 500 })
    }
}