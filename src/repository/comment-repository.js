import CrudRepository from "./crud-repository.js";
import Comment from "../models/comments.js";
import Tweet from "../models/tweet.js";
import User from "../models/user.js";

class CommentRepository extends CrudRepository {
    constructor(){
        super(Comment);
    }

    async getByUser(userId, offset = 0, limit = 10) {
        try {
            const comments = await Comment.find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .populate({
                    path: 'commentable',
                    populate: { path: 'user', select: 'name username' }
                })
                .populate({ path: 'userId', select: 'name username' })
                .lean();

            // Exclude comments where the parent tweet was deleted
            const validComments = comments.filter(c => {
                if (c.onModel === 'Tweet') {
                    return c.commentable !== null && c.commentable !== undefined;
                }
                return true;
            });

            return validComments;
        } catch (error) {
            throw error;
        }
    }

    async getAllCommentsForTweet(tweetId, session = null) {
        try {
            const opts = session ? { session } : {};
            const allCommentIds = new Set();

            // 1. Find direct comments on the tweet
            const directComments = await Comment.find({
                onModel: 'Tweet',
                commentable: tweetId
            }, '_id', opts).lean();

            let currentBatch = [];
            for (const c of directComments) {
                const idStr = c._id.toString();
                allCommentIds.add(idStr);
                currentBatch.push(c._id);
            }

            // 2. Iteratively find all nested replies
            while (currentBatch.length > 0) {
                const nestedComments = await Comment.find({
                    onModel: 'Comment',
                    commentable: { $in: currentBatch }
                }, '_id', opts).lean();

                currentBatch = [];
                for (const n of nestedComments) {
                    const idStr = n._id.toString();
                    if (!allCommentIds.has(idStr)) {
                        allCommentIds.add(idStr);
                        currentBatch.push(n._id);
                    }
                }
            }

            return Array.from(allCommentIds);
        } catch (error) {
            throw error;
        }
    }

    async deleteManyByIds(commentIds, session = null) {
        try {
            if (!Array.isArray(commentIds) || commentIds.length === 0) {
                return { deletedCount: 0 };
            }
            const opts = session ? { session } : {};
            const result = await Comment.deleteMany({ _id: { $in: commentIds } }, opts);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default CommentRepository;
