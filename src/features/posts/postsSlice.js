import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// createAsyncThunk similar to useEffect // help to handle async operation // to run once only everytime it triggers

const BASE_URL =
    "https://bf5cd2b3-e25e-405b-88ca-5f3ad24fded2-00-38g012z3zpyd5.sisko.replit.dev";

export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser", // name of database table
    async (userId) => {
        // getting response from API
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
        return response.json(); // converting API into JSON
    }
);

export const savePost = createAsyncThunk(
    "posts/savePost",
    // grabbing token 
    async (postContent) => {
        const token = localStorage.getItem("authToken");
        const decode = jwtDecode(token);
        const userId = decode.id;

        // setting request body
        const data = {
            title: "Post Title",
            content: postContent,
            user_id: userId,
        };

        const response = await axios.post(`${BASE_URL}/posts`, data);
        return response.data;
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},
    extraReducers: (builder) => {
        // 3 properties: pending, fulfilled & rejected
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload,
                state.loading = false;
        }),
            builder.addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
            })
    },
});

export default postsSlice.reducer;