import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const GET = async (request, { params }) => {
    try {
        const { slug: searchTerm } = params; // Get search term from params
        
        await connectToDatabase();
        const users = await User.aggregate([
            {
                $match: { name: { $regex: searchTerm, $options: "i" } } // Case-insensitive match
            },
        ]);
        
        if (users.length === 0) {
            return new Response(JSON.stringify({ message: "No users found!" }), { status: 404 });
        }
        
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
};
