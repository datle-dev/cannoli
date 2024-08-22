import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import Post from "../components/Post";
import Comment from "../components/Comment";
import { fetchRefresh } from "../utils/fetchUtils";
import Spinner from "../components/Spinner";
import styles from "./PostDetail.module.css"

export default function PostDetail() {
  const routeParams = useParams();

  const post = useQuery({
    queryKey: ["post", "detail"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/posts/${routeParams.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return res.json();
    },
    retry: 1,
  })

  const comments = useQuery({
    queryKey: ["post", "comments"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/comments/?post_id=${routeParams.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      return res.json();
    },
    retry: 1,
  })

  if (post.isPending || comments.isPending) {
    return <Spinner />
  }

  return (
    <>
      <h2 className={styles.heading}>Post</h2>
      <Post post={post.data} />
      {comments.data.map((comment, index) => {
        return <Comment comment={comment} key={index} />
      })}
    </>
  )
}