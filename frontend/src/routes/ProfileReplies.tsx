import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { fetchRefresh } from "../utils/fetchUtils";

export default function ProfileReplies() {
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const viewingUserData = queryClient.getQueryData(["user", "viewing"]);

  const viewingUserId = viewingUserData?.id;

  const replies = useQuery({
    queryKey: ["replies", "user", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/comments/?user_id=${viewingUserId}`,
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

  if (replies.isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <title>Cannoli | {routeParams.username} Replies</title>
      {replies.isSuccess && (
        <>
          {replies.data?.map((reply, index) => {
            return <Comment comment={reply} key={index}/>;
          })}
        </>
      )}
    </>
  );
}
