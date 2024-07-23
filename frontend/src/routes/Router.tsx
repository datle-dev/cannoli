import { createBrowserRouter} from "react-router-dom";
import Root from "./Root.tsx";
import Error from "./Error.tsx";
import Home from "./Home.tsx";
import Profile from "./Profile.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

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
        path: "profile",
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
    ],
  },
]);

export default Router
