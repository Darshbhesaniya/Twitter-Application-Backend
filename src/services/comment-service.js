import { CommentRepository, TweetRepository } from "../repository/index.js";

class CommentService {
    constructor(){
        this.CommentRepository = new CommentRepository();
        this.tweetRepository = new TweetRepository();
    }

    async create(modelId, modelType, userId, content){
        if (modelType === 'Tweet'){
            var commentable = await this.tweetRepository.get(modelId);
        } else if (modelType === 'Comment'){
            var commentable = await this.CommentRepository.get(modelId);
        } else {
            throw new Error('unknown model type');
        }

        const comment = await this.CommentRepository.create({
            content: content,
            userId: userId,
            onModel: modelType,
            commentable: modelId,
            comments: []
        });

        commentable.comments.push(comment);
        await commentable.save();
        return comment;
    }

    async getMyComments(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const comments = await this.CommentRepository.getByUser(userId, offset, limit);
            return comments;
        } catch (error) {
            throw error;
        }
    }
}

export default CommentService;
