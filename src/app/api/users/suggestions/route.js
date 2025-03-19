import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import getUserData from "@/utils/getUserData";

export async function GET(request) {
    try {
        // return the top 4 users with more followers and more articles
        await connectToDatabase();
        const user = await getUserData();

        if (!user)
            return new Response(JSON.stringify({ message: "UnAuthorized" }), {
                status: 401,
            });

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: user._id, $nin: user.following },
                },
            },
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "articles",
                },
            },
            {
                $addFields: {
                    articleCount: { $size: "$articles" },
                    followerCount: { $size: "$following" },
                },
            },
            {
                $sort: { followerCount: -1, articleCount: -1 },
            },
            {
                $limit: 4,
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    image: 1,
                    followerCount: 1,
                    articleCount: 1,
                },
            },
        ]);

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
}
