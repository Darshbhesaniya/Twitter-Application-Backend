import express from 'express';
import { PORT } from './config/serverconfig.js';

import { connect } from './config/database.js';

import apiRoutes from './routes/index.js';

import { UserRepository, TweetRepository } from './repository/index.js';
import LikeService from './services/like-service.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);





app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");

    const userRepo = new UserRepository();
    const tweetRepo = new TweetRepository();
    const tweets = await tweetRepo.getAll(0, 10);
  
    const user = await userRepo.getAll();

    const likeService = new LikeService();
    await likeService.toggleLike(tweets[0].id, 'Tweet', user[0].id);
})