import express from 'express';

import { createTweet, destroyTweet, getTweet, getAllTweets } from '../../controller/tweet-controller.js';
import { toggleLike, getMyLikedTweets } from '../../controller/like-controller.js';
import { createComment, getMyComments } from '../../controller/comment-controller.js';
import { login, signup } from '../../controller/auth-controller.js';
import { getProfile, getUser } from '../../controller/user-controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

// /api/v1/tweets
router.post('/tweets', authenticate, upload.single("image"), createTweet);
router.get('/tweets/:id', getTweet);
router.delete('/tweets/:id', authenticate, destroyTweet);
router.get('/tweets', getAllTweets);

// Likes
router.post('/likes/toggle', authenticate, toggleLike);
router.get('/likes/me', authenticate, getMyLikedTweets);

// Comments
router.post('/comments', authenticate, createComment);
router.get('/comments/me', authenticate, getMyComments);

// Users
router.get('/users/me', authenticate, getProfile);
router.get('/users/:id', getUser);

// Auth
router.post('/signup', signup);
router.post('/login', login);

export default router;
