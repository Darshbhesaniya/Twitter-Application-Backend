import UserService from "../services/user-service.js";

const userservice = new UserService();

export const signup = async (req, res) => {
    try {
        const response = await userservice.signup({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });

        return res.status(201).json({
            success: true,
            message: 'Successfully Created a new user',
            data: response,
            err: {}
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went Wrong',
            data: {},
            success: false,
            err: error
        })
    }
}

export const login = async (req, res) => {
    try {
        const token = await userservice.signIn(req.body);
        return res.status(200).json({
            success: true,
            message: 'Successfully Loggen In',
            data: token,
            err: {}
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went Wrong',
            data: {},
            success: false,
            err: error
        })
    }
}