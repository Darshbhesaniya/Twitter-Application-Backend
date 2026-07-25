import express from 'express';

import { createTweet,getTweet } from '../../controller/tweet-controller.js';
import { toggleLike } from '../../controller/like-controller.js'
import { createComment } from '../../controller/comment-controller.js'

const router = express.Router();

// /api/v1/tweets
router.post('/tweets',createTweet);
router.get('/tweets/:id',getTweet)

router.post('/likes/toggle',toggleLike)

router.post('/comments',createComment)

export default router;