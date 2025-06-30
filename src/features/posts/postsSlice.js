import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const BASE_URL =
    "https://twitter-api-sigmaschooltech.sigma-school-full-stack.repl.co";

export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`); // locating the posts path

            const querySnapshot = await getDocs(postsRef); // grabbing query from database
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const savePost = createAsyncThunk(
    "posts/savePost",
    async ({ userId, postContent }) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`);
            console.log(`users/${userId}/posts`);
            const newPostRef = doc(postsRef); // referencing the newly grabbed data as newPostRef
            console.log(postContent);
            await setDoc(newPostRef, { content: postContent, likes: [] }) // setting the content of the new post
            const newPost = await getDoc(newPostRef); // fetching the document just created 
            const post = {
                id: newPost.id,
                ...newPost.data(),
            }

            return post;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const likePost = createAsyncThunk(
    "posts/LikePost",
    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);
            const docSnapshot = await getDoc(postRef);

            if (docSnapshot.exists()) {
                const postData = docSnapshot.data();
                const likes = [...postData.likes, userId];

                await setDoc(postRef, { ...postData, likes }); // adding the like to the post 
            }

            return { userId, postId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)

export const removeLikeFromPost = createAsyncThunk(
    "posts/removeLikeFromPost",
    async ({ userId, postId }) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);
            const docSnapshot = await getDoc(postRef);

            if (docSnapshot.exists()) {
                const postData = docSnapshot.data();
                const likes = postData.likes.filter((id) => id !== userId); // 

                await setDoc(postRef, { ...postData, likes }); // adding the like to the post 
            }

            return { userId, postId };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsByUser.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload;

                const postIndex = state.posts.findIndex((post) => post.id === postId);

                if (postIndex !== -1) {
                    state.posts(postIndex).likes.push(userId);
                }
            })
            .addCase(removeLikeFromPost.fulfilled, (state, action) => {
                const { userId, postId } = action.payload;

                const postIndex = state.posts.findIndex((post) => post.id === postId);

                if (postIndex !== -1) {
                    state.posts[postIndex].likes = state.posts[postIndex].likes.filter((id) => id !== userId);
                }
            })
    },
});

export default postsSlice.reducer;
