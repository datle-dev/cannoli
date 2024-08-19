import { useState, useContext } from "react";
import { Link } from "react-router-dom"
import { RiMoreFill, RiPencilLine } from "react-icons/ri"
import { RxHome, RxPerson } from "react-icons/rx";
import * as Dialog from "@radix-ui/react-dialog";
import { AuthContext } from "../App";
import CreatePostLimited from "./CreatePostLimited";
import LogoutButton from "./LogoutButton";
import styles from "./NavBottom.module.css";

export default function NavBottom() {
  const { user } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={styles.navBottom}>
      <nav className={styles.nav}>
        <Link to={"home"} className={styles.navLink}>
          <RxHome />
        </Link>
        <Link
          to={`profile/${user.data?.username}/posts`}
          className={styles.navLink}
          reloadDocument
        >
          <RxPerson />
        </Link>
      </nav>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <button type="button" className={styles.navButton}>
            <RiPencilLine />
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
      <div className={styles.more}>
        <RiMoreFill />  
      </div>
      
      {/* <LogoutButton /> */}
    </div>
  )
}