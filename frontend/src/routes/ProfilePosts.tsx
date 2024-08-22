import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import Post from "../components/Post";
import Spinner from "../components/Spinner";

export default function ProfilePosts() {
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const viewingUserData = queryClient.getQueryData(["user", "viewing"]);

  const viewingUserId = viewingUserData?.id;

  const posts = useQuery({
    queryKey: ["posts", "user", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/posts/?user_id=${viewingUserId}`,
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

  if (posts.isPending) {
    return <Spinner />;
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Posts</title>
      {posts.isSuccess && (
        <>
          {posts.data?.map((post, index) => {
            return <Post post={post} key={index} />;
          })}
        </>
      )}
    </>
  );
}
