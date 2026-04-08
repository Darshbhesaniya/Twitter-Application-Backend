const express = require('express');
const connect = require('./config/database');
const app = express();

const { PORT } = require('./config/serverconfig');

const TweetRepository = require('./repository/tweet-repository');
const Comment = require('./models/comments');

app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");
    // const tweet = await Tweet.create({
    //     content:'Fifth Tweet',
    //     userEmail: 'a@b.com'
    // });

    // const tweets = await Tweet.find({userEmail: 'a@b.com'})

    const tweetRepo =new TweetRepository();
    
    const tweet = await tweetRepo.getWithComments('69d6473c50af5504d0e88d68');
    
    console.log(tweet);
    
})