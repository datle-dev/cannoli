import { Outlet } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../App";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Nav from "../components/Nav";
import CreatePostLimited from "../components/CreatePostLimited";
import LogoutButton from "../components/LogoutButton";
import styles from "./Root.module.css";

export default function Root() {
  const { user } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <header>
        {user.data && (
          <>
            <Nav />
            <LogoutButton />
          </>
        )}
      </header>
      <main>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <button type="button">Create Post</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.dialogOverlay}/>
            <Dialog.Content className={styles.dialogContent}>
              <div className={styles.dialogTopRow}>
                <Dialog.Title>Create Post</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button">Close</button>
              </Dialog.Close>
              </div>
              <Dialog.Description>Accessible description</Dialog.Description>
              <CreatePostLimited onSuccessSetDialogOpen={setDialogOpen}/>
              <Dialog.Close asChild>
                <button type="button">Cancel</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Outlet />
      </main>
      <footer>
        <h2>Footer</h2>
        <Nav />
      </footer>
    </>
  );
}
