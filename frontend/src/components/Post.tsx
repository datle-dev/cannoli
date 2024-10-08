import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RiHeart3Line, RiHeart3Fill, RiChat3Line, RiCloseFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { Tooltip } from "react-tooltip";
import styles from "./Post.module.css";

dayjs.extend(relativeTime);

type PostType = {
  id: number;
  user_id: number;
  content: string;
  like_count: number;
  liked_by_user: boolean;
  create_date: string;
};

export default function Post({ post }) {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(Number(post.like_count));
  const [isLiked, setIsLiked] = useState(Boolean(post.liked_by_user));
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const commentMutation = useMutation({
    mutationFn: async (data) => {
      console.log("comment mutationFn fired");
      console.log(JSON.stringify({ ...data, post_id: post.id }));
      return await fetch("http://127.0.0.1:8000/comments/", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          post_id: post.id,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log("comment mutation success");
      // queryClient.invalidateQueries({queryKey: ['user']})
      // navigate("/home")
    },
  });

  function handlePostLike(e) {
    e.stopPropagation();
    console.log("handle post like");
    likeMutation.mutate();
  }

  function handlePostUnlike(e) {
    e.stopPropagation();
    console.log("handle post unlike");
    unlikeMutation.mutate();
  }

  function handlePostComment(data) {
    console.log("handle post comment");
    commentMutation.mutate(data);
    setDialogOpen(false);
  }

  function handleClickPost() {
    if (dialogOpen) {
      return;
    } else {
      navigate(`/post/${post.id}/`);
    }
  }

  // the following are only for preventing like/reply button
  // clicks from triggering underlying post div's navigation
  // via handleClickPost()
  function handleOpenCommentDialog(e) {
    e.stopPropagation();
  }

  function handleGoToProfile(e) {
    e.stopPropagation();
  }

  return (
    <article className={styles.post} onClick={handleClickPost}>
      <div className={styles.postLeft}>
        <a href={`/profile/${post.username}/posts`} onClick={handleGoToProfile}>
          <p className={styles.avatar}>
            {post.avatar[0] +
              " " +
              post.avatar[1] +
              " " +
              post.avatar[2]}
          </p>
        </a>
      </div>
      <div className={styles.postRight}>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <div className={styles.postTopRow}>
            <a
              href={`/profile/${post.username}/posts`}
              onClick={handleGoToProfile}
            >
              <p className={styles.username}>{post.username}</p>
            </a>

            <span>·</span>
            <p className={styles.date}>
              {dayjs(post.create_date).year === dayjs().year
                ? dayjs(post.create_date).format("MMM DD")
                : // dayjs(post.create_date).fromNow()
                  dayjs(post.create_date).format("MMM DD, YYYY")}
            </p>
          </div>
          <p>{post.content}</p>
          <div className={styles.postBottomRow}>
            {isLiked ? (
              <div className={styles.likes}>
                <button
                  type="button"
                  onClick={handlePostUnlike}
                  className={styles.likeUnlikeButton}
                  data-tooltip-id="unlike-tooltip"
                  data-tooltip-delay-show={1000}
                >
                  <IconContext.Provider
                    value={{ className: styles.unlikeIcon }}
                  >
                    <RiHeart3Fill />
                    
                  </IconContext.Provider>
                </button>
                <Tooltip id="unlike-tooltip" style={{ zIndex: 99 }}>
                  <p>Unlike</p>
                </Tooltip>
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
                  data-tooltip-id="like-tooltip"
                  data-tooltip-delay-show={1000}
                >
                  <IconContext.Provider value={{ className: styles.likeIcon }}>
                    <RiHeart3Line />
                  </IconContext.Provider>
                </button>
                <Tooltip id="like-tooltip" style={{ zIndex: 99 }}>
                  <p>Like</p>
                </Tooltip>
                {likeCount > 0 && <span>{likeCount}</span>}
              </div>
            )}
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={styles.commentButton}
                onClick={handleOpenCommentDialog}
                data-tooltip-id="reply-tooltip"
                data-tooltip-delay-show={1000}
              >
                <IconContext.Provider value={{ className: styles.commentIcon }}>
                  <RiChat3Line />
                </IconContext.Provider>
              </button>
            </Dialog.Trigger>
            <Tooltip id="reply-tooltip" style={{ zIndex: 99 }}>
              <p>Reply</p>
            </Tooltip>
          </div>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.dialogOverlay} />
            <Dialog.Content className={styles.dialogContent}>
              <VisuallyHidden.Root>
                <Dialog.Title>Reply to post {post.id}</Dialog.Title>
                <Dialog.Description>Accessible description</Dialog.Description>
              </VisuallyHidden.Root>
              <Form.Root
                onSubmit={handleSubmit(handlePostComment)}
                className={styles.formRoot}
              >
                <Form.Field name="content" className={styles.formField}>
                  <div className={styles.formTopRow}>
                    <Form.Label><h2>Reply</h2></Form.Label>
                    <Dialog.Close asChild>
                      <button type="button" className={styles.replyCloseButton}>
                        <RiCloseFill />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Form.Control asChild>
                    <textarea
                      id="content"
                      placeholder="Write your reply"
                      {...register("content", {
                        required: true,
                        maxLength: {
                          value: 256,
                          message: "Max of 256 characters",
                        },
                      })}
                    />
                  </Form.Control>
                  <Form.Message asChild className={styles.formError}>
                    <p>{errors.content?.message}</p>
                  </Form.Message>
                </Form.Field>
                <div className={styles.formBottomRow}>
                  <Dialog.Close asChild>
                    <button type="button" className={styles.replyCancelButton}>Cancel</button>
                  </Dialog.Close>
                  <Form.Submit className={styles.replyButton}>Reply</Form.Submit>
                </div>
              </Form.Root>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </article>
  );
}
