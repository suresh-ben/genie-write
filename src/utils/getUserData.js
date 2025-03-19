import { getUserById } from "@/actions/account";
import { auth } from "@/lib/auth";

export default async function getUserData() {
    try {
        const session = await auth();
        const userId = session.user._id;

        const user = await getUserById(userId);
        return user;
    } catch (error) {
        return null;
    }
}
