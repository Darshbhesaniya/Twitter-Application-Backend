import Tweet from '../models/tweet.js';
import Like from '../models/like.js';
import CrudRepository from './crud-repository.js';

class TweetRepository extends CrudRepository {
    constructor(){
        super(Tweet)
    }

    async create(data){
        try {
            const tweet = await Tweet.create(data);
            // Populate user (including username) and likes so response includes author & like details
            const populated = await Tweet.findById(tweet._id)
                .populate({ path: 'user', select: 'name email username' })
                .populate({ path: 'likes' })
                .lean();
            return populated;
        } catch (error) {
            console.log(error);
        }
    }

    async getWithComments(id){
        try {
            const tweet = await Tweet.findById(id)
                .populate({ path: 'user', select: 'name email username' })
                .populate({
                    path: 'comments',
                    populate: { path: 'comments' }
                })
                .populate({ path: 'likes' })
                .lean();
            return tweet;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(offset, limit, userId = null){
        try {
            // Build filter: if userId provided, only return that user's tweets
            const filter = userId ? { user: userId } : {};
            const tweets = await Tweet.find(filter)
                .populate({ path: 'user', select: 'name email username' })
                .populate({ path: 'likes' })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .lean();
            return tweets;
        } catch (error) {
            console.log(error);
        }
    }

    async find(id){
        try {
            const tweet = await Tweet.findById(id).populate({ path: 'likes' });
            return tweet;
        } catch (error) {
            console.log(error);
        }
    }
}

export default TweetRepository;
