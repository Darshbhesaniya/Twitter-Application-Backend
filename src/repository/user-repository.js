import CrudRepository from "./crud-repository.js";
import User from "../models/user.js";

class UserRepository extends CrudRepository{
    constructor(){
        super(User)
    }

    async findBy(data) {
        try {
            const response = await User.findOne(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async get(id) {
        try {
            const response = await User.findById(id).select("-password");
            return response;
        } catch (error) {
            throw error;
        }
    }

}

export default UserRepository;
