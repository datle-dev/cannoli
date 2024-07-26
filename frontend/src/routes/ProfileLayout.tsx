import { useContext } from "react"
import { Outlet, Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchRefresh } from "../utils/fetchUtils"
import { AuthContext } from "../App"

export default function ProfileLayout() {
  const { user } = useContext(AuthContext)
  const routeParams = useParams()
  const viewingUser = useQuery({
    queryKey: ["user", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/user/${routeParams.username}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })

  if (viewingUser.isPending) {
    return <p>Loading...</p>
  }

  // if (!user.data) {
  //   console.log('redirect to login')
  //   return <Navigate to="/login" replace={true} />
  // }

  return (
    <>
      <h2>Profile Layout</h2>
      <p>profile layout viewing user: {JSON.stringify(viewingUser)}</p>
      <Outlet />
    </>
  )
}