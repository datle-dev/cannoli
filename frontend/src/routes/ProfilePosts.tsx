import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import Post from "../components/Post";

export default function ProfilePosts() {
  const routeParams = useParams()
  const queryClient = useQueryClient()
  const viewingUserData = queryClient.getQueryData(["user", "viewing"])

  const viewingUserId = viewingUserData?.id

  const posts = useQuery({
    queryKey: ['posts', 'user', 'viewing'],
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

  if (posts.isPending) {
    return <p>Loading...</p>
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Posts</title>
      <h2>Profile Posts</h2>
      <Link to={""}>Posts</Link>
      <Link to={`/profile/${routeParams.username}/liked/posts`}>Liked Posts</Link>
      <Link to={`/profile/${routeParams.username}/replies`}>Replies</Link>
      <Link to={`/profile/${routeParams.username}/liked/replies`}>Liked Replies</Link>
      <p>These are profile posts</p>
      <p>profile posts viewing user data: {JSON.stringify(viewingUserData)}</p>
      <p>posts: {JSON.stringify(posts)}</p>
      {posts.isSuccess && (
          <>
            <h2>Posts</h2>
            {posts.data?.map((post, index) => {
              return <Post post={post} key={index} />
            })}
          </>
      )}
    </>
  )
}