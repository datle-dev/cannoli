import { useState, useEffect } from "react";
import Post from "./Post";

export default function AllFeed() {
  const [posts, setPosts] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      console.log("http://127.0.0.1:8000/posts/")
      await fetch("http://127.0.0.1:8000/posts/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setPosts(data)
          setIsLoading(false)
        })
        .catch((err) => console.log(err));
    }

    fetchPosts()
  }, [])

  return (
    <>
      {!isLoading && (
        posts.map((post, index) => <Post post={post} key={index}/>)
      )}
    </>
  )

}