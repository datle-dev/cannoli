import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { RiLogoutBoxLine } from "react-icons/ri";
import { AuthContext } from "../App";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("logout mutationFn fired");
      return await fetch("http://127.0.0.1:8000/auth/token/blacklist/", {
        method: "POST",
        body: JSON.stringify({
          refresh: localStorage.getItem("refresh"),
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log("logout mutation success");
      queryClient.resetQueries({ queryKey: ["user"] });
      navigate("/login");
    },
  });

  async function handleLogout() {
    console.log("handleData logout fired");
    mutation.mutate();
    console.log("handle logout");
  }

  return (
    <button type="button" onClick={handleLogout} className={styles.navButton}>
      <RiLogoutBoxLine />
      <span>Logout</span>
    </button>
  )

}
