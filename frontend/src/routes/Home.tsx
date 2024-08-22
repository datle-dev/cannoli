import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import AllFeed from "../components/AllFeed";
import Spinner from "../components/Spinner";
import styles from "./Home.module.css";

export default function Home() {
  const { user } = useContext(AuthContext)
  
  if (user.isPending) {
    return <Spinner />
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
      <h2 className={styles.heading}>Home</h2>
      <AllFeed />
    </>
  )
  
}