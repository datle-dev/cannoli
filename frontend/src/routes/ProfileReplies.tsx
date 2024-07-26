import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";

export default function ProfileReplies() {
  const routeParams = useParams()
  const queryClient = useQueryClient()
  const viewingUserData = queryClient.getQueryData(["user", "viewing"])

  const viewingUserId = viewingUserData?.id

  const replies = useQuery({
    queryKey: ['replies', 'user', 'viewing'],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/posts/?user_id=${viewingUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })

  if (replies.isPending) {
    return <p>Loading...</p>
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Replies</title>
      <h2>Profile Replies</h2>
      <Link to={`/profile/${routeParams.username}`}>Posts</Link>
      <Link to={`/profile/${routeParams.username}/liked/posts`}>Liked Posts</Link>
      <Link to={""}>Replies</Link>
      <Link to={`/profile/${routeParams.username}/liked/replies`}>Liked Replies</Link>
      <p>These are profile replies</p>
      <p>profile replies viewing user data: {JSON.stringify(viewingUserData)}</p>
      <p>replies: {JSON.stringify(replies)}</p>
      {replies.isSuccess && (
          <>
            <h2>Replies</h2>
            {replies.data?.map((reply, index) => {
              return <p key={index}>{JSON.stringify(reply)}</p>
            })}
          </>
      )}
    </>
  )
}