import { LikeRepository,TweetRepository } from '../repository/index.js';
import Tweet from '../models/tweet.js';

class LikeService {
    constructor(){
        this.likeRepository = new LikeRepository();
        this.tweetRepository = new TweetRepository();
    }

    async toggleLike(modelId,modelType, userId){ // api/v1/likes/toggle?id=model&type=Tweet
        console.log(modelId,modelType,userId);
        if(modelType == 'Tweet'){
            var likeable = await this.tweetRepository.find(modelId);
        } else if(modelType == 'Comment'){
            //  after implement comment model
        } else {
            throw new Error('unknown model type');
        }

        // this is a check in database if there is like is exists or not in DB with these parameter
        const exists = await this.likeRepository.findByUserAndLikeable({
            user: userId,
            onModel: modelType,
            likeable: modelId
        });
        console.log("EXISTS",exists);
        // if like is exists in datanse then execute this statement
        if(exists){
            likeable.likes.pull(exists._id);
            await likeable.save();
            await exists.deleteOne(); // ✅ fixed
            var isAdded = false;
        }
        // if like is not found is database then this statement execute 
         else {
            const newLike = await this.likeRepository.create({
                user:userId,
                onModel: modelType,
                likeable: modelId
            });
            likeable.likes.push(newLike._id);
            await likeable.save();
            var isAdded = true;
        }
        return isAdded;
    }

}  

export default LikeService;