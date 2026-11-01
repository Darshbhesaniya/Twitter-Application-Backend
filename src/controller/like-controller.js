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
}
