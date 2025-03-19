import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    heading: {
        type: String,
        required: true,
    },
    article: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    disLikes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    }
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
