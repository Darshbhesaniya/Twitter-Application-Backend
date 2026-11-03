import LikeService from "../services/like-service.js";

const likeservice = new LikeService();

export const toggleLike = async (req, res) => {
    try {
        const modelId = req.query.modelId || req.query.id;
        const modelType = req.query.modelType || req.query.type;
        const userId = req.user.id;

        const response = await likeservice.toggleLike(modelId, modelType, userId);
        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: "Successfully toggle like"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            data: {},
            message: 'something went Wrong ',
            err: error
        });
    }
};

export const getMyLikedTweets = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const tweets = await likeservice.getUserLikedTweets(req.user.id, page, limit);
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched liked tweets',
            data: tweets,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went Wrong',
            data: [],
            err: error
        });
    }
};
