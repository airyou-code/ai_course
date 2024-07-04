import axios from "axios";

export default class PostsService {
    static async getPosts() {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return response.data;
    }
}