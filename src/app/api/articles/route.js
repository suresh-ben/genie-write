import Article from "@/models/Article";
import getUserData from "@/utils/getUserData";
import { connectToDatabase } from "@/lib/mongodb";

export const POST = async (request) => {
    try {
        const user = await getUserData();

        if (!user)
            return new Response(JSON.stringify({ message: "UnAuthorized" }), {
                status: 401,
            });

        const { heading, article, thumbnail } = await request.json();
        await connectToDatabase();

        const newArticle = await Article.create({
            heading,
            article,
            thumbnail,
            createdBy: user._id,

            slug:
                heading
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^a-z0-9-]/g, "") +
                "-" +
                Math.floor(Math.random() * 10000000000),
        });

        return new Response(
            JSON.stringify({
                message: "Article uploaded succeffully!",
                article: newArticle,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Something went wrong while uploading article!",
            }),
            { status: 500 }
        );
    }
};
