import Article from "@/models/Article";
import { connectToDatabase } from "@/lib/mongodb";
import getUserData from "@/utils/getUserData";

export const POST = async (request, { params }) => {
    try {
        await connectToDatabase();
        const { slug: articleSlug } = params;
        const user = await getUserData();

        if (!user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        const article = await Article.findOne({ slug: articleSlug });
        if (!article) {
            return new Response(
                JSON.stringify({ message: "Article not found" }),
                { status: 404 }
            );
        }

        const userId = user._id;

        const isLiked = article.likes.includes(userId);
        if (isLiked) {
            // Remove like if already liked
            await Article.updateOne(
                { slug: articleSlug },
                { $pull: { likes: userId } }
            );
        } else {
            // Add like if not liked
            await Article.updateOne(
                { slug: articleSlug },
                { $addToSet: { likes: userId } }
            );

            //remove dislike if have
            await Article.updateOne(
                { slug: articleSlug },
                { $pull: { disLikes: userId } }
            );
        }

        // Get updated like count
        const updatedArticle = await Article.findOne({ slug: articleSlug });
        const likeCount = updatedArticle.likes.length;

        return new Response(JSON.stringify({ message: "Success", likeCount }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Something went wrong!", error }),
            { status: 500 }
        );
    }
};
