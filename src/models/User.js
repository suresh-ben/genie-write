import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sub: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        select: false
    },
    image: {
        type: String,
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        default: [],
        index: true,
    }
}, { timestamps: true });

export default mongoose.models?.User || mongoose.model("User", UserSchema);
