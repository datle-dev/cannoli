import { useState, useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../App";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { RiPencilFill } from "react-icons/ri";
import Nav from "../components/Nav";
import NavMobile from "../components/NavMobile";
import CreatePostLimited from "../components/CreatePostLimited";
import LogoutButton from "../components/LogoutButton";
import NavBar from "../components/NavBar";
import NavBottom from "../components/NavBottom";

import styles from "./Root.module.css";

export default function Root() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* <header></header> */}
      <aside className={styles.aside}>
        {user.data && <NavBar />}
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
      <aside className={styles.right}>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </aside>
      <div className={styles.bottom}>
        <NavBottom />
      </div>
      {/* <NavMobile /> */}
      {/* <footer className={styles.footer}>
        <h2>Footer</h2>
        <Nav />
      </footer> */}
    </>
  );
}
