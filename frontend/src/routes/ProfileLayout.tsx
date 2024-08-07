import { useState, useContext } from "react";
import { Outlet, useParams, NavLink, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { RiCalendar2Line } from "react-icons/ri";
import { fetchRefresh } from "../utils/fetchUtils";
import { AuthContext } from "../App";
import styles from "./ProfileLayout.module.css";

export default function ProfileLayout() {
  const { user } = useContext(AuthContext);
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [unfollowButtonText, setUnfollowButtonText] = useState("Following");

  const viewingUser = useQuery({
    queryKey: ["user", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/user/${routeParams.username}/`,
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

  const viewingProfile = useQuery({
    queryKey: ["profile", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/profiles/${viewingUser.data.profile_id}/`,
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

  const followMutation = useMutation({
    mutationFn: async () => {
      console.log("follow mutationFn fired");
      return await fetch(
        `http://127.0.0.1:8000/user/${viewingUser.data.id}/follow/`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.data.pk,
            following_user_id: viewingUser.data.id,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    },
    onSuccess: () => {
      console.log("follow mutation success");
      queryClient.refetchQueries({ queryKey: ["user", "viewing"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      console.log("unfollow mutationFn fired");
      return await fetch(
        `http://127.0.0.1:8000/user/${viewingUser.data.id}/unfollow/`,
        {
          method: "DELETE",
          body: JSON.stringify({
            user_id: user.data.pk,
            following_user_id: viewingUser.data.id,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    },
    onSuccess: () => {
      console.log("unfollow mutation success");
      queryClient.refetchQueries({ queryKey: ["user", "viewing"] });
    },
  });

  function handleFollow() {
    console.log(`handle follow user: ${viewingUser.data.username}`);
    followMutation.mutate();
  }

  function handleUnfollow() {
    console.log(`handle unfollow user: ${viewingUser.data.username}`);
    unfollowMutation.mutate();
  }

  if (viewingUser.isPending || viewingProfile.isPending) {
    return <p>Loading...</p>;
  }

  const switchNavLinkClass = ({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? styles.pending : "",
      isActive ? styles.active : "",
      isTransitioning ? styles.transitioning : "",
    ].join(" ");

  function handleUnfollowButtonMouseEnter() {
    setUnfollowButtonText("Unfollow");
  }

  function handleUnfollowButtonMouseLeave() {
    setUnfollowButtonText("Following");
  }

  function handleEditProfile() {
    navigate("/edit/profile")
  }

  return (
    <>
      <h2>Profile</h2>
      <div className={styles.bio}>
        <p className={styles.avatar}>
          {viewingProfile.data.avatar[0] +
            " " +
            viewingProfile.data.avatar[1] +
            " " +
            viewingProfile.data.avatar[2]}
        </p>
        <div className={styles.usernameRow}>
          <div className={styles.usernameRowLeft}>
            <h3>{viewingProfile.data.username}</h3>
            <p>{viewingUser.data.followed_by_user && "Follows you"}</p>
          </div>
          {user.data?.pk !== viewingUser.data?.id &&
            viewingUser.data?.following_user && (
              <button
                type="button"
                onClick={handleUnfollow}
                onMouseEnter={handleUnfollowButtonMouseEnter}
                onMouseLeave={handleUnfollowButtonMouseLeave}
                className={styles.unfollowButton}
              >
                {unfollowButtonText}
              </button>
            )}
          {user.data?.pk !== viewingUser.data?.id &&
            !viewingUser.data?.following_user && (
              <button
                type="button"
                onClick={handleFollow}
                className={styles.followButton}
              >
                Follow
              </button>
            )}
          {user.data?.pk === viewingUser.data?.id && (
            <button
            type="button"
            onClick={handleEditProfile}
            className={styles.editProfileButton}
          >
            Edit Profile
          </button>
          )}
        </div>
        <p>{viewingProfile.data.about}</p>
        <p className={styles.joinDate}>
          <RiCalendar2Line /> Joined{" "}
          {dayjs(viewingUser.data.date_joined).format("MMMM YYYY")}
        </p>
        <Link to={`/profile/${viewingUser.data.username}/following`} className={styles.followingFollowerLink}>
          {viewingUser.data.following_count} Following
        </Link>
        <Link to={`/profile/${viewingUser.data.username}/followers`} className={styles.followingFollowerLink}>
          {viewingUser.data.follower_count}{" "}
          {viewingUser.data.follower_count === 1 ? "Follower" : "Followers"}
        </Link>
      </div>

      <nav className={styles.nav}>
        <NavLink
          end
          to={`/profile/${routeParams.username}/posts`}
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? styles.pending : "",
              isActive ? styles.active : "",
              isTransitioning ? styles.transitioning : "",
            ].join(" ")
          }
        >
          Posts
        </NavLink>
        <NavLink
          end
          to={`/profile/${routeParams.username}/liked/posts`}
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? styles.pending : "",
              isActive ? styles.active : "",
              isTransitioning ? styles.transitioning : "",
            ].join(" ")
          }
        >
          Liked Posts
        </NavLink>
        <NavLink
          end
          to={`/profile/${routeParams.username}/replies`}
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? styles.pending : "",
              isActive ? styles.active : "",
              isTransitioning ? styles.transitioning : "",
            ].join(" ")
          }
        >
          Replies
        </NavLink>
        <NavLink
          end
          to={`/profile/${routeParams.username}/liked/replies`}
          className={switchNavLinkClass}
        >
          Liked Replies
        </NavLink>
      </nav>

      <section className={styles.section}>
        <Outlet />
      </section>
    </>
  );
}
