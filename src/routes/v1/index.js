import express from 'express';

import { createTweet, destroyTweet, getTweet, getAllTweets} from '../../controller/tweet-controller.js';
import { toggleLike } from '../../controller/like-controller.js'
import { createComment } from '../../controller/comment-controller.js'
import { login, signup } from '../../controller/auth-controller.js'
import { authenticate } from '../../middlewares/authenticate.js'
import upload from '../../middlewares/multer.js';

const router = express.Router();

// /api/v1/tweets
router.post('/tweets',authenticate, upload.single("image"), createTweet);
router.get('/tweets/:id', getTweet)
router.delete('/tweets/:id',authenticate,destroyTweet);
router.get('/tweets',getAllTweets);


router.post('/likes/toggle', toggleLike)

router.post('/comments', authenticate, createComment)

router.post('/signup', signup)

router.post('/login', login)

export default router;