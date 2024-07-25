import { useContext } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { fetchRefresh } from "../utils/fetchUtils"
import { AuthContext } from "../App"

export default function User() {
  const routeParams = useParams()
  const { user } = useContext(AuthContext);
  const viewingUser = useQuery({
    queryKey: ['user', 'viewing'],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/user/${routeParams.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })

  const followMutation = useMutation({
    mutationFn: async () => {
      console.log("follow mutationFn fired");
      return await fetch(`http://127.0.0.1:8000/user/${routeParams.id}/follow/`, {
        method: "POST",
        body: JSON.stringify({
          user_id: user.data.pk,
          following_user_id: viewingUser.data.id,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))
    },
    onSuccess: () => {
      console.log("follow mutation success")
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      console.log("unfollow mutationFn fired");
      return await fetch(`http://127.0.0.1:8000/user/${routeParams.id}/unfollow/`, {
        method: "DELETE",
        body: JSON.stringify({
          user_id: user.data.pk,
          following_user_id: viewingUser.data.id,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))
    },
    onSuccess: () => {
      console.log("unfollow mutation success")
    },
  })

  function handleFollow() {
    console.log(`handle follow user: ${viewingUser.data.username}`)
    followMutation.mutate()
  }

  function handleUnfollow() {
    console.log(`handle unfollow user: ${viewingUser.data.username}`)
    unfollowMutation.mutate()
  }

  if (viewingUser.isPending) {
    return <p>Loading...</p>
  }

  if (viewingUser.isError) {
    return <p>Error: {viewingUser.error.message}</p>
  }

  return (
    <>
      <h2>User</h2>
      <p>You are user {user.data.pk}</p>
      <p>Info about user {routeParams.id}</p>
      <p>user: {JSON.stringify(viewingUser)}</p>
      <button type="button" onClick={handleFollow}>Follow</button>
      <button type="button" onClick={handleUnfollow}>Unfollow</button>
    </>
  )
}