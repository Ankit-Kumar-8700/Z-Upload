import {createSlice} from "@reduxjs/toolkit";

const initialState={
    serverLink:"http://localhost:8000",
    mode:"light",
    user:{
      links:[]
    },
    linkData:{},
    token:null
};

export const authSlice = createSlice({
    name: "z-upload",
    initialState,
    reducers: {
      setMode: (state) => {
        state.mode = state.mode==="light" ? "dark" : "light";
      },
      setUser:(state,action) => {
        state.user=action.payload.user;
      },
      setLogin: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      },
      setLogout: (state) => {
        state.user = null;
        state.token = null;
      },
      setLink: (state,action) => {
        state.linkData = action.payload.linkData;
      }
    //   setFriends: (state, action) => {
    //     if (state.user) {
    //       state.user.friends = action.payload.friends || [];
    //     } else {
    //       console.error("user does not exist");
    //     }
    //   },
    //   setPosts: (state, action) => {
    //     state.posts = action.payload.posts;
    //   },
    //   setPost: (state, action) => {
    //     const updatedPosts = state.posts.map((post) => {
    //       if (post._id === action.payload.post._id) return action.payload.post;
    //       return post;
    //     });
    //     state.posts = updatedPosts;
    //   },
    },
  });
  
  export const { setMode, setLogin, setUser, setLogout, setLink } =
    authSlice.actions;
  export const authReducer= authSlice.reducer;