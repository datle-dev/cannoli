import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { RxHome, RxPerson } from "react-icons/rx";
import { RiPencilFill, RiMoreFill } from "react-icons/ri";
import { AuthContext } from "../App";
import CreatePostLimited from "./CreatePostLimited";
import LogoutButton from "./LogoutButton";
import { fetchRefresh } from "../utils/fetchUtils";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { user } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userMe = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      console.log("user useQuery fired");
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/user/${user.data.username}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      return await res.json();
    },
    retry: 1,
  });

  const userMeProfileId = userMe.data?.profile_id;

  const profileMe = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      console.log("user useQuery fired");
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/profiles/${userMe.data.profile_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      return await res.json();
    },
    enabled: !!userMeProfileId,
    retry: 1,
  });

  if (!user.data) {
    return (
      <nav className={styles.nav}>
        <Link to={"login"}>Login</Link>
        <Link to={"register"}>Register</Link>
      </nav>
    );
  }

  function handleGoToProfile() {
    console.log("handle go to profile");
  }

  return (
    <div className={styles.navBar}>
      <nav className={styles.nav}>
        <Link to={"home"} className={styles.siteTitle}>
          Cannoli
        </Link>
        <Link to={"home"} className={styles.navLink}>
          <RxHome />
          <span>Home</span>
        </Link>
        <Link
          to={`profile/${user.data.username}/posts`}
          className={styles.navLink}
        >
          <RxPerson />
          <span>Profile</span>
        </Link>
      </nav>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <button type="button" className={styles.navButton}>
            <RiPencilFill />
            <span>Create Post</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <div className={styles.dialogTopRow}>
              <Dialog.Title>Create Post</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button">Close</button>
              </Dialog.Close>
            </div>
            <Dialog.Description>Accessible description</Dialog.Description>
            <CreatePostLimited onSuccessSetDialogOpen={setDialogOpen} />
            <Dialog.Close asChild>
              <button type="button">Cancel</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <LogoutButton />
      {profileMe.isSuccess && (
        <div className={styles.me}>
          <div className={styles.meLeft}>
            <a
              href={`/profile/${profileMe.data.username}`}
              onClick={handleGoToProfile}
            >
              {/* <p className={styles.avatar}>{profileMe.data.avatar}</p> */}
              <p className={styles.avatar}>{"T ~ T"}</p>
            </a>
            <p>{profileMe.data.username}</p>
          </div>
          <div className={styles.meRight}>
            <RiMoreFill />
          </div>
        </div>
      )}
    </div>
  );
}
