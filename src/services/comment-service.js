import {CommentRepository,TweetRepository } from "../repository/index.js";

class CommentService {
    constructor(){
        this.CommentRepository = new CommentRepository();
        this.tweetRepository = new TweetRepository();
    }

    async create(modelId,modelType,userId,content){
        if(modelType == 'Tweet'){
            var commentable = await this.tweetRepository.get(modelId);
        } else if(modelType == 'Comment'){
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
        })
        commentable.comments.push(comment);
        await commentable.save();
    }
}

export default CommentService;