import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

type PostType = {
  id: number,
  user_id: number,
  content: string,
  like_count: number,
  liked_by_user: boolean,
  create_date: string,
}

export default function Post({ post }) {
  const [likeCount, setLikeCount] = useState(Number(post.like_count));
  const [isLiked, setIsLiked] = useState(Boolean(post.liked_by_user));

  const likeMutation = useMutation({
    mutationFn: async () => {
      console.log("like mutationFn fired");
      return await fetch(`http://127.0.0.1:8000/posts/likes/`, {
        method: "POST",
        body: JSON.stringify({ post_id: post.id }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLikeCount(likeCount + 1);
          setIsLiked(true);
        })
        .catch((err) => console.log(err));
      },
    onSuccess: () => {
      console.log("like mutation success");
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      console.log("unlike mutationFn fired");
      return await fetch(`http://127.0.0.1:8000/posts/unlikes/`, {
        method: "POST",
        body: JSON.stringify({ post_id: post.id }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLikeCount(likeCount - 1);
          setIsLiked(false);
        })
        .catch((err) => console.log(err));
      },
    onSuccess: () => {
      console.log("unlike mutation success");
    },
  });

  function handlePostLike() {
    console.log('handle post like')
    likeMutation.mutate()
  }

  function handlePostUnlike() {
    console.log('handle post unlike')
    unlikeMutation.mutate()
  }

  return (
    <article>
      <p>id: {post.id}</p>
      <p>user_id: {post.user_id}</p>
      <p>Content: {post.content}</p>
      <p>Likes: {likeCount}</p>
      <p>create_date: {post.create_date}</p>
      {isLiked ? (
        <>
          <button type="button" onClick={handlePostUnlike}>
            Unlike
          </button>
          <span>LIKED</span>
        </>
      ) : (
        <button type="button" onClick={handlePostLike}>
          Like
        </button>
      )}
    </article>
  );
}
