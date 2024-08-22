import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import Post from "../components/Post";
import Spinner from "../components/Spinner";

export default function ProfileLikes() {
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const viewingUserData = queryClient.getQueryData(["user", "viewing"]);

  const viewingUserId = viewingUserData?.id;

  const likedPosts = useQuery({
    queryKey: ["liked", "posts"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/posts/likes/?user_id=${viewingUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return res.json();
    },
    retry: 1,
  });

  if (likedPosts.isPending) {
    return <Spinner />;
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Liked Posts</title>
      {likedPosts.isSuccess && (
        <>
          {likedPosts.data?.map((post, index) => {
            return <Post post={post} key={index} />;
          })}
        </>
      )}
    </>
  );
}
