import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import Post from "../components/Post";

export default function ProfileLikes() {
  const routeParams = useParams()
  const queryClient = useQueryClient()
  const viewingUserData = queryClient.getQueryData(["user", "viewing"])

  const viewingUserId = viewingUserData?.id

  const likedPosts = useQuery({
    queryKey: ['liked', 'posts'],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/posts/likes/?user_id=${viewingUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })

  if (likedPosts.isPending) {
    return <p>Loading...</p>
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Liked Posts</title>
      <h2>Profile Likes</h2>
      <Link to={`/profile/${routeParams.username}`}>Posts</Link>
      <Link to={""}>Liked Posts</Link>
      <Link to={`/profile/${routeParams.username}/replies`}>Replies</Link>
      <Link to={`/profile/${routeParams.username}/liked/replies`}>Liked Replies</Link>
      <p>These are profile likes</p>
      <p>profile likes viewing user data: {JSON.stringify(viewingUserData)}</p>
      <p>{JSON.stringify(likedPosts)}</p>
      {likedPosts.isSuccess && (
          <>
            <h2>Liked Posts</h2>
            {likedPosts.data?.map((post, index) => {
              return <Post post={post} key={index} />
            })}
          </>
      )}
    </>
  )
}