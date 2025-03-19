import axios from "axios";

export const getRecomendedUsers = async () => {
    try {
        const res = await axios.get('/api/users/suggestions');
        return res.data;
    } catch (error) {
        throw new Error(error.message || "Unable to fetch users");
    }
}

export const getUserDetailsById = async (_id) => {
    try {
        const res = await axios.get(`/api/users/details/${_id}`);
        return res.data;
    } catch (error) {
        throw new Error(error.message || "Unable to fetch users");
    }
}

export const followUser = async (_id) => {
    try {
        const res = await axios.post(`/api/users/follow/`, { userId: _id });
        return res.data;
    } catch (error) {
        throw new Error(error.message || "Unable to fetch users");
    }
}

export const unFollowUser = async (_id) => {
    try {
        console.log("hit", _id)
        const res = await axios.post(`/api/users/unfollow/`, { userId: _id });
        return res.data;
    } catch (error) {
        throw new Error(error.message || "Unable to fetch users");
    }
}

export const searchUsers = async (searchTerm) => {
    try {
        const res = await axios.get(`/api/users/search/${searchTerm}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}