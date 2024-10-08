import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { fetchRefresh } from "../utils/fetchUtils";
import Spinner from "../components/Spinner";

export default function ProfileLikedReplies() {
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const viewingUserData = queryClient.getQueryData(["user", "viewing"]);

  const viewingUserId = viewingUserData?.id;

  const likedReplies = useQuery({
    queryKey: ["liked", "comments"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/comments/likes/?user_id=${viewingUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return res.json();
    },
    enabled: !!viewingUserId,
    retry: 1,
  });

  if (likedReplies.isPending) {
    return <Spinner />;
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Liked Replies</title>
      {likedReplies.isSuccess && (
        <>
          {likedReplies.data?.map((reply, index) => {
            return <Comment comment={reply} key={index}/>;
          })}
        </>
      )}
    </>
  );
}
