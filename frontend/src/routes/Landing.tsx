import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../App"

export default function Landing() {
  const user = useContext(AuthContext)

  if (user) {
    return <Navigate to="home" replace={true} />
  }

  return <Navigate to="login" replace={true} />
}