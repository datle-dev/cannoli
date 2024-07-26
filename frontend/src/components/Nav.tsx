import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

export default function Nav() {
  const { user } = useContext(AuthContext);

  if (!user.data) {
    return (
      <nav>
        <ul>
          <li>
            <Link to={`login`}>Login</Link>
          </li>
          <li>
            <Link to={`register`}>Register</Link>
          </li>
        </ul>
      </nav>  
    )
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to={`home`}>Home</Link>
        </li>
        <li>
          <Link to={`profile/${user.data.username}`}>Profile</Link>
        </li>
      </ul>
    </nav>
  );
}
