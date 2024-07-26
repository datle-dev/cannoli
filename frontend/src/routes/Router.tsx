import { createBrowserRouter} from "react-router-dom";
import Root from "./Root.tsx";
import Error from "./Error.tsx";
import Home from "./Home.tsx";
import Profile from "./Profile.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import User from "./User.tsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile/:username",
        element: <Profile />,
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
    ],
  },
]);

export default Router
