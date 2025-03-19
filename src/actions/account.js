import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const signInorUpWithPassword = async (name, email, password) => {
    try {
        if(!email || !password) throw new Error("Required params are missing");
        await connectToDatabase();

        //check if any user is exists on email
        const existingUser = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if(existingUser) {
            // Check if password is correct
            const isMatch = await bcrypt.compare(password, existingUser.password);
            
            if (!isMatch) throw new Error("Invalid Credentials!");
            return existingUser;
        }

        //create user
        //hash password: Hash the password before saving the new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
        return newUser;
    } catch (error) {
        throw new Error(error.message || "Unable to sign user");
    }
}

//can be used only inside token,session fucntions in auth ,as these functions triggers after authentication
export const signInOrUpByEmailOrSubAfterAuthentication = async (name, email, sub, image) => {
    try {
        if(!email && !sub) throw new Error("Required params are missing");
        await connectToDatabase();

        //check if any user is exists on email or sub
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { sub }]
        });

        if(existingUser && image) {
            existingUser.image = image;
            await existingUser.save();
        }

        if(existingUser) return existingUser;

        //create user
        const newUser = await User.create({ name, email: email?.toLowerCase(), sub, image: image || "" });
        return newUser;
    } catch (error) {
        throw new Error(error.message || "Unable to sign user");
    }
}

export const getUserById = async (_id) => {
    try {
        if(!_id) throw new Error("Required params are missing");
        await connectToDatabase();

        const user = await User.findById(_id);
        if(!user) throw new Error("No user found");

        return user;
    } catch (error) {
        throw new Error(error.message || "Unable to sign user");
        
    }
}