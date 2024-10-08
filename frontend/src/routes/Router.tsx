import { createBrowserRouter} from "react-router-dom";
import Root from "./Root.tsx";
import Error from "./Error.tsx";
import Home from "./Home.tsx";
import ProfileLayout from "./ProfileLayout.tsx";
import ProfilePosts from "./ProfilePosts.tsx";
import ProfileLikedPosts from "./ProfileLikedPosts.tsx";
import ProfileReplies from "./ProfileReplies.tsx";
import ProfileLikedReplies from "./ProfileLikedReplies.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import User from "./User.tsx";
import PostDetail from "./PostDetail.tsx";
import EditProfile from "./EditProfile.tsx";
import ProfileFollowing from "./ProfileFollowing.tsx";
import ProfileFollowers from "./ProfileFollowers.tsx";
import Landing from "./Landing.tsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile/:username",
        element: <ProfileLayout />,
        children: [
          {
            path: "posts",
            element: <ProfilePosts />
          },
          {
            path: "liked/posts",
            element: <ProfileLikedPosts />,
          },
          {
            path: "replies",
            element: <ProfileReplies />,
          },
          {
            path: "liked/replies",
            element: <ProfileLikedReplies />,
          },
        ],
      },
      {
        path: "profile/:username/following",
        element: <ProfileFollowing />,
      },
      {
        path: "profile/:username/followers",
        element: <ProfileFollowers />,
      },
      {
        path: "edit/profile",
        element: <EditProfile />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "user/:id",
        element: <User />,
      },
      {
        path: "post/:id",
        element: <PostDetail />,
      },
    ],
  },
]);

export default Router
