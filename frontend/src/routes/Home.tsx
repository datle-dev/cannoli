import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import AllFeed from "../components/AllFeed";
import AllComments from "../components/AllComments";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const { user } = useContext(AuthContext)

  
  if (user.isPending) {
    return <p>Loading...</p>
  }
  
  if (!user.data) {
    console.log('redirect to login')
    return <Navigate to="/login" replace={true} />
  }

  if (user.isError) {
    return <p>Error: {user.error.message}</p>
  }

  return (
    <>
      <title>Cannoli | Home</title>
      <h2>Home</h2>
      <CreatePost />
      <h3>Feed</h3>
      <AllFeed />
      <AllComments />
    </>
  )
  
}