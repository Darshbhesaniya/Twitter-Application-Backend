import { TweetRepository, HashtagRepository, CommentRepository, LikeRepository } from '../repository/index.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/upload.js';
class TweetService {
    constructor() {
        this.tweetRepository = new TweetRepository();
        this.hashtagRepository = new HashtagRepository();
        this.commentRepository = new CommentRepository();
        this.likeRepository = new LikeRepository();
    }

    async create(data, file) {
        
         if (file) {
            const result = await uploadOnCloudinary(file.path);

            if (result) {
                data.image = result.secure_url;
                data.imagePublicId = result.public_id;
            }
        }

        const content = data.content;
        let tags = content.match(/#[a-zA-Z0-9_]+/g) || []; // this regex extracts hashtags
        tags = tags.map((tag) => tag.substring(1));   // for remove a "#" Ex: #coding => coding 
        tags = tags.map((tag) => tag.toLowerCase())   // for convert to lowercase 

        // 1. create a new tweet 
        const tweet = await this.tweetRepository.create(data);


        // 2 find already present Tags in the hashtag model
        let alreadyPresentTags = await this.hashtagRepository.findByName(tags);
        let titleofPresenttags = alreadyPresentTags.map((tags) => tags.title);

        // 3. extract new tags 
        let newTags = tags.filter(tag => !titleofPresenttags.includes(tag));
        newTags = newTags.map(tag => {
            return { title: tag, tweets: [tweet.id] }
        });

        // 4. create a new tags in hashtag model using a bulkcreate 
        await this.hashtagRepository.bulkCreate(newTags);

        for (const tag of alreadyPresentTags) {
            tag.tweets.push(tweet.id);
            tag.markModified('tweets');
            await tag.save();
        }

        return tweet;
    }

    async get(tweetId) {
        const tweet = await this.tweetRepository.getWithComments(tweetId)
        return tweet;
    }

    async destroy(tweetId, userId){
        const tweet = await this.tweetRepository.get(tweetId);

        if(!tweet){
            throw new Error("Tweet Not Found")
        }

        if (userId && tweet.user && tweet.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized: Only the tweet owner can delete this tweet");
        }

        if(tweet.imagePublicId){
            await deleteFromCloudinary(tweet.imagePublicId);
        }

        // Step 1: Collect all comment IDs (direct + nested) for this tweet
        let commentIds = [];
        try {
            commentIds = await this.commentRepository.getAllCommentsForTweet(tweetId);
        } catch (err) {
            console.error('Warning: Failed to collect comment IDs for cascade delete:', err.message);
        }

        // Step 2: Delete all collected comments
        if (commentIds.length > 0) {
            try {
                await this.commentRepository.deleteManyByIds(commentIds);
            } catch (err) {
                console.error('Warning: Failed to cascade-delete comments:', err.message);
            }
        }

        // Step 3: Delete all likes associated with this tweet
        try {
            await this.likeRepository.deleteManyByLikeable(tweetId);
        } catch (err) {
            console.error('Warning: Failed to cascade-delete likes:', err.message);
        }

        const response = await this.tweetRepository.destroy(tweetId);
        return response;
    }

    async getAll(page, limit, userId = null){

        const offset = (page - 1) * limit;
        
        const tweets = await this.tweetRepository.getAll(offset, limit, userId);

        return tweets;
    }
}

export default TweetService;
