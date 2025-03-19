import axios from "axios";

export const generateArticle = async (prompt) => {
    try {
        const res = await axios.post('/api/ai', { prompt });
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadArticle = async (heading, article, thumbnail) => {
    try {
        const res = await axios.post('/api/articles', { heading, article, thumbnail })
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getRecomendedArticels = async () => {
    try {
        const res = await axios.get('/api/articles/suggestions')
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestArticels = async () => {
    try {
        const res = await axios.get('/api/articles/latest')
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getPopularArticles = async () => {
    try {
        const res = await axios.get('/api/articles/popular')
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFollowingArticles = async () => {
    try {
        const res = await axios.get('/api/articles/following')
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getArticleData = async (slug) => {
    try {
        const res = await axios.get(`/api/articles/${slug}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserArticles = async (_id) => {
    try {
        const res = await axios.get(`/api/articles/by-user/${_id}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchArticles = async (searchTerm) => {
    try {
        const res = await axios.get(`/api/articles/search/${searchTerm}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const likeArticle = async (slug) => {
    try {
        const res = await axios.post(`/api/articles/like/${slug}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const dislikeArticle = async (slug) => {
    try {
        const res = await axios.post(`/api/articles/dislike/${slug}`)
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}