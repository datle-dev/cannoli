import { Link, NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiArrowLeftSLine } from "react-icons/ri";
import ProfileListing from "../components/ProfileListing";
import { fetchRefresh } from "../utils/fetchUtils";
import Spinner from "../components/Spinner";
import styles from "./ProfileFollow.module.css";

export default function ProfileFollowers() {
  const routeParams = useParams();

  const switchNavLinkClass = ({ isActive, isPending, isTransitioning }) =>
    [
      isPending ? styles.pending : "",
      isActive ? styles.active : "",
      isTransitioning ? styles.transitioning : "",
    ].join(" ");

  const viewingUser = useQuery({
    queryKey: ["user", "viewing", "followers"],
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

  const followerProfiles = useQuery({
    queryKey: ["profile", "viewing", "followers"],
    queryFn: async () => {
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/user/${viewingUserId}/followers/`,
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

  if (followerProfiles.isPending) {
    return <Spinner />;
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
      {followerProfiles.data.map((profile, index) => {
        return <ProfileListing profile={profile} key={index} />;
      })}
    </>
  );
}
