import { LikeRepository, TweetRepository } from '../repository/index.js';
import Tweet from '../models/tweet.js';

class LikeService {
    constructor(){
        this.likeRepository = new LikeRepository();
        this.tweetRepository = new TweetRepository();
    }

    async toggleLike(modelId, modelType, userId){
        console.log("Toggle Like Feature From like-service:", modelId, modelType, userId);
        if (modelType === 'Tweet'){
            var likeable = await this.tweetRepository.find(modelId);
        } else if (modelType === 'Comment'){
            // after implement comment model
        } else {
            throw new Error('unknown model type');
        }

        const exists = await this.likeRepository.findByUserAndLikeable({
            user: userId,
            onModel: modelType,
            likeable: modelId
        });

        console.log("Like is EXISTS", exists);
        if (exists){
            likeable.likes.pull(exists._id);
            await likeable.save();
            await exists.deleteOne(); 
            var isAdded = false;
        } else {
            const newLike = await this.likeRepository.create({
                user: userId,
                onModel: modelType,
                likeable: modelId
            });
            likeable.likes.push(newLike._id);
            await likeable.save();
            var isAdded = true;
        }
        return isAdded;
    }

    async getUserLikedTweets(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const tweets = await this.likeRepository.getUserLikedTweets(userId, offset, limit);
            return tweets;
        } catch (error) {
            throw error;
        }
    }
}  

export default LikeService;
