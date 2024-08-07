import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./ProfileListing.module.css";

export default function ProfileListing({ profile }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()

  function handleGoToProfile(e) {
    console.log("handle go to profile");
    // e.stopPropagation()
  }

  return (
    <Link to={`/profile/${profile.username}/posts`} reloadDocument>
      <article className={styles.postListing}>
        <div className={styles.bio}>
          <a
            href={`/profile/${profile.username}/posts`}
          >
            <p className={styles.avatar}>
              {profile.avatar[0] +
                " " +
                profile.avatar[1] +
                " " +
                profile.avatar[2]}
            </p>
          </a>
          <div className={styles.postTopRow}>
            <a
              href={`/profile/${profile.username}/posts`}
              className={styles.username}
            >
              <p className={styles.username}>{profile.username}</p>
            </a>
          </div>
        </div>
        <p>{profile.about}</p>
      </article>
    </Link>
  );
}
