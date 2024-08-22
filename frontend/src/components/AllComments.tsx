import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../App";
import { fetchRefresh } from "../utils/fetchUtils";
import Spinner from "./Spinner";

export default function AllComments() {
  const { user } = useContext(AuthContext)

  const comments = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const res = await fetchRefresh("http://127.0.0.1:8000/comments/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
  })

  if (comments.isPending) {
    return <Spinner />
  }

  if (comments.isError) {
    return <p>Error: {comments.error.message}</p>
  }

  return (
    <>
      {comments.data.map((comment, index: number) => {
        return (
          <p key={index}>{JSON.stringify(comment)}</p>
        )
      })}
    </>
  )

}