import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        max: [250, 'Tweet Cannot be more than 250 Charcters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    image: {
        type: String,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Tweet = mongoose.model('Tweet', tweetSchema);
export default Tweet;
