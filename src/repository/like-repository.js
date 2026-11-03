import Like from '../models/like.js';
import Tweet from '../models/tweet.js';
import User from '../models/user.js';
import CrudRepository from "./crud-repository.js";

class LikeRepository extends CrudRepository {
    constructor(){
        super(Like);
    }

    async findByUserAndLikeable(data){
        try {
            const like = await Like.findOne(data);
            return like;
        } catch (error) {
            throw error;
        }
    }

    async getUserLikedTweets(userId, offset = 0, limit = 10) {
        try {
            const likes = await Like.find({ user: userId, onModel: 'Tweet' })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .populate({
                    path: 'likeable',
                    populate: [
                        { path: 'user', select: 'name username' },
                        { path: 'likes' }
                    ]
                })
                .lean();

            // Extract the valid liked tweet objects (safely filtering out deleted tweets)
            const tweets = likes
                .map(like => like.likeable)
                .filter(tweet => tweet !== null && tweet !== undefined);

            return tweets;
        } catch (error) {
            throw error;
        }
    }

    async deleteManyByLikeable(tweetId, session = null) {
        try {
            const opts = session ? { session } : {};
            const result = await Like.deleteMany({ onModel: 'Tweet', likeable: tweetId }, opts);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default LikeRepository;
