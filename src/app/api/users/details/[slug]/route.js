import getUserData from "@/utils/getUserData";
import User from "@/models/User";
import Article from "@/models/Article";

export const GET = async (request, { params }) => {
    try {
        const user = await getUserData();
        if (!user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        const { slug: userId } = params;

        // Fetch user details and populate following users
        const foundUser = await User.findById(userId).populate(
            "following",
            "name email image"
        );

        if (!foundUser) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        // Count followers (users who have this user in their "following" list)
        const followersCount = await User.countDocuments({ following: userId });

        // Get following users' IDs
        const followingIds = foundUser.following.map((f) => f._id);

        // Get article counts for each following user
        const articlesCountMap = await Article.aggregate([
            { $match: { createdBy: { $in: followingIds } } },
            { $group: { _id: "$createdBy", count: { $sum: 1 } } },
        ]);

        // Get followers count for each following user
        const followersCountMap = await User.aggregate([
            { $match: { following: { $in: followingIds } } },
            { $group: { _id: "$following", count: { $sum: 1 } } },
        ]);

        // Convert aggregation results into a dictionary for quick lookup
        const articleCounts = Object.fromEntries(
            articlesCountMap.map(({ _id, count }) => [_id.toString(), count])
        );
        const followersCounts = Object.fromEntries(
            followersCountMap.map(({ _id, count }) => [_id.toString(), count])
        );

        // Append articles count and followers count to each following user
        const followingWithStats = foundUser.following.map((followedUser) => ({
            ...followedUser.toObject(),
            articlesCount: articleCounts[followedUser._id.toString()] || 0,
            followersCount: followersCounts[followedUser._id.toString()] || 0,
        }));

        return new Response(
            JSON.stringify({
                ...foundUser.toObject(),
                followersCount,
                following: followingWithStats,
            }),
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
