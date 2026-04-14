const express = require('express');
const connect = require('./config/database');
const app = express();

const { PORT } = require('./config/serverconfig');

const { TweetRepository } = require('./repository/index');
const TweeetService = require('./services/tweet-service');

app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");

    // let repo = new HashtagRepository();
    //     await repo.bulkCreate([
    //         {
    //             title: 'IPL26',
    //             tweets: []
    //         }
    //     ])

    let service = new TweeetService();
    const tweet = await service.create({content: 'my #working Twitter'});
    console.log(tweet);
    
})