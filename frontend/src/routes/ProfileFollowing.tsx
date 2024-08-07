import { Link, NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiArrowLeftSLine } from "react-icons/ri";
import ProfileListing from "../components/ProfileListing";
import { fetchRefresh } from "../utils/fetchUtils";
import styles from "./ProfileFollow.module.css";

export default function ProfileFollowing() {
  const routeParams = useParams();

  const switchNavLinkClass = ({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? styles.pending : "",
      isActive ? styles.active : "",
      isTransitioning ? styles.transitioning : "",
    ].join(" ");

  const viewingUser = useQuery({
    queryKey: ["user", "viewing", "following"],
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

  const viewingUserId = viewingUser.data?.id;

  const followingProfiles = useQuery({
    queryKey: ["profile", "viewing", "following"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/user/${viewingUserId}/following/`,
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

  if (followingProfiles.isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Link
        to={`/profile/${viewingUser.data.username}/posts`}
        className={styles.back}
      >
        <RiArrowLeftSLine />
        Back to Profile
      </Link>
      <nav className={styles.nav}>
        <NavLink
          end
          to={`/profile/${routeParams.username}/following`}
          className={switchNavLinkClass}
        >
          Following
        </NavLink>
        <NavLink
          end
          to={`/profile/${routeParams.username}/followers`}
          className={switchNavLinkClass}
        >
          Followers
        </NavLink>
      </nav>
      {followingProfiles.data.map((profile, index) => {
        return <ProfileListing profile={profile} key={index} />;
      })}
    </>
  );
}
