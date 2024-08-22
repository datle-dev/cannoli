import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../App";
import Post, { PostType } from "./Post";
import { fetchRefresh } from "../utils/fetchUtils";
import Spinner from "./Spinner";

export default function AllFeed() {
  const { user } = useContext(AuthContext)

  const feed = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const res = await fetchRefresh("http://127.0.0.1:8000/posts/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
  })

  if (feed.isPending) {
    return <Spinner />
  }

  if (feed.isError) {
    return <p>Error: {feed.error.message}</p>
  }

  return (
    <>
      {feed.data.map((post, index: number) => <Post post={post} key={index}/>)}
    </>
  )

}