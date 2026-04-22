import express from 'express';

import { createTweet } from '../../controller/tweet-controller.js';

const router = express.Router();

// /api/v1/tweets
router.post('/tweets',createTweet);

export default router;