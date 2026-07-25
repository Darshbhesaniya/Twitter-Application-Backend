import { TweetRepository, HashtagRepository } from '../repository/index.js';
class TweetService {
    constructor() {
        this.tweetRepository = new TweetRepository();
        this.hashtagRepository = new HashtagRepository();
    }

    async create(data) {
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
        /**
         * 1. Bulkcreate in mongoose
         * 2. filter title of hashtag based on multiple tags
         * 3. How to addtweet id inside all the hashtags
         */
        return tweet;
    }

    async get(tweetId) {
        const tweet = await this.tweetRepository.getWithComments(tweetId)
        return tweet;
    }

}

export default TweetService;