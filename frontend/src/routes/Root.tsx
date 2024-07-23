import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";
import Nav from "../components/Nav";
import LogoutButton from "../components/LogoutButton";

export default function Root() {
  const { user } = useContext(AuthContext)

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
        <Outlet />
      </main>
      <footer>
        <h2>Footer</h2>
        <Nav />
      </footer>
    </>
  );
  
}
