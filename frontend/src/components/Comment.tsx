import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RiHeart3Line, RiHeart3Fill, RiChat3Line } from "react-icons/ri";
import { IconContext } from "react-icons";
import styles from "./Comment.module.css";

dayjs.extend(relativeTime);

type CommentType = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  like_count: number;
  liked_by_user: boolean;
  create_date: string;
};

export default function Comment({ comment }) {
  const [likeCount, setLikeCount] = useState(Number(comment.like_count));
  const [isLiked, setIsLiked] = useState(Boolean(comment.liked_by_user));

  const likeMutation = useMutation({
    mutationFn: async () => {
      console.log("like mutationFn fired");
      return await fetch(`http://127.0.0.1:8000/comments/likes/`, {
        method: "POST",
        body: JSON.stringify({ comment_id: comment.id }),
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
      return await fetch(`http://127.0.0.1:8000/comments/unlikes/`, {
        method: "POST",
        body: JSON.stringify({ comment_id: comment.id }),
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

  function handlePostLike(e) {
    e.stopPropagation();
    console.log("handle comment like");
    likeMutation.mutate();
  }

  function handlePostUnlike(e) {
    e.stopPropagation();
    console.log("handle comment unlike");
    unlikeMutation.mutate();
  }

  return (
    <article className={styles.comment}>
      <div className={styles.commentLeft}>
        <a href={`/profile/${comment.username}/posts`}>
          <p className={styles.avatar}>
            {comment.avatar[0] +
              " " +
              comment.avatar[1] +
              " " +
              comment.avatar[2]}
          </p>
        </a>
      </div>
      <div className={styles.commentRight}>
        <div className={styles.commentTopRow}>
          <a href={`/profile/${comment.username}/posts`}>
            <p className={styles.username}>{comment.username}</p>
          </a>
          <span>·</span>
          <p className={styles.date}>
            {dayjs(comment.create_date).year === dayjs().year
              ? dayjs(comment.create_date).format("MMM DD")
              : // dayjs(post.create_date).fromNow()
                dayjs(comment.create_date).format("MMM DD, YYYY")}
          </p>
        </div>
        <p>{comment.content}</p>
        <div className={styles.commentBottomRow}>
          {isLiked ? (
            <div className={styles.likes}>
              <button
                type="button"
                onClick={handlePostUnlike}
                className={styles.likeUnlikeButton}
              >
                <IconContext.Provider value={{ className: styles.unlikeIcon }}>
                  <RiHeart3Fill />
                </IconContext.Provider>
              </button>
              {likeCount > 0 && (
                <span className={styles.liked}>{likeCount}</span>
              )}
            </div>
          ) : (
            <div className={styles.likes}>
              <button
                type="button"
                onClick={handlePostLike}
                className={styles.likeUnlikeButton}
              >
                <IconContext.Provider value={{ className: styles.likeIcon }}>
                  <RiHeart3Line />
                </IconContext.Provider>
              </button>
              {likeCount > 0 && <span>{likeCount}</span>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
