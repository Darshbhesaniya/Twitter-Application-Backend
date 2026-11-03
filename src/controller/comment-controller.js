import CommentService from "../services/comment-service.js";
const commentService = new CommentService();

export const createComment = async (req, res) => {
    try {
        const response = await commentService.create(req.query.modelId, req.query.modelType, req.user.id, req.body.content);
        return res.status(201).json({
            success: true,
            message: 'successfully created a new Comment',
            data: response,
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something Went Wrong',
            data: {},
            error: error
        });
    }
};

export const getMyComments = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const comments = await commentService.getMyComments(req.user.id, page, limit);
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched user comments',
            data: comments,
            error: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something Went Wrong',
            data: [],
            error: error
        });
    }
};
