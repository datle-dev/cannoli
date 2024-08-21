import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../App";
import NavBar from "../components/NavBar";
import NavBottom from "../components/NavBottom";

import styles from "./Root.module.css";

export default function Root() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <aside className={styles.aside}>
        {user.data && <NavBar />}
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
      <div className={styles.bottom}>
        <NavBottom />
      </div>
    </>
  );
}
