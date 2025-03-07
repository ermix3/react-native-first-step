import { Post } from '@/models/Post';
import axios from 'axios';
import FormData from 'form-data';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL
});

export const PostService = {
  //   Create a new post with optional image
  createPost: async (post: Post, image?: any): Promise<Post> => {
    const formData = new FormData();

    formData.append('post',{
      string: JSON.stringify(post),
      type: "application/json",
    });

    if (image) {
        formData.append("image",image);
    }
    
    console.log('formData Post: ', formData);

    return await axiosInstance.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
  },

  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await axiosInstance.get('');
    return response.data;
  },

  // Get a post by ID
  getPostById: async (id: number): Promise<PostResponse> => {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  },

  // Update a post with optional new image
  updatePost: async (updatedPost: Post, image?: any): Promise<Post> => {
    const formData = new FormData();
    // formData.append(
    //   'postDetails',
    //   new Blob([JSON.stringify(updatedPost)], { type: 'application/json' })
    // );
    formData.append(
      'postJson',
      JSON.stringify(updatedPost)
    );

    if (image) {
      formData.append("image", image);
    }

    const response = await axiosInstance.patch(`/${updatedPost.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Delete a post
  deletePost: async (id: number) => {
    return await axiosInstance.delete(`/${id}`);
  },
};
