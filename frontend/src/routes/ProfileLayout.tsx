import { useState, useContext } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import { AuthContext } from "../App";

export default function ProfileLayout() {
  const { user } = useContext(AuthContext);
  const routeParams = useParams();
  const queryClient = useQueryClient()

  const viewingUser = useQuery({
    queryKey: ["user", "viewing"],
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

  const followMutation = useMutation({
    mutationFn: async () => {
      console.log("follow mutationFn fired");
      return await fetch(
        `http://127.0.0.1:8000/user/${viewingUser.data.id}/follow/`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.data.pk,
            following_user_id: viewingUser.data.id,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    },
    onSuccess: () => {
      console.log("follow mutation success");
      queryClient.refetchQueries({queryKey: ["user", "viewing"]})
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      console.log("unfollow mutationFn fired");
      return await fetch(
        `http://127.0.0.1:8000/user/${viewingUser.data.id}/unfollow/`,
        {
          method: "DELETE",
          body: JSON.stringify({
            user_id: user.data.pk,
            following_user_id: viewingUser.data.id,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    },
    onSuccess: () => {
      console.log("unfollow mutation success");
      queryClient.refetchQueries({queryKey: ["user", "viewing"]})
    },
  });

  function handleFollow() {
    console.log(`handle follow user: ${viewingUser.data.username}`);
    followMutation.mutate();
  }

  function handleUnfollow() {
    console.log(`handle unfollow user: ${viewingUser.data.username}`);
    unfollowMutation.mutate();
  }

  if (viewingUser.isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Profile Layout</h2>
      <p>profile layout viewing user: {JSON.stringify(viewingUser)}</p>
      {user.data?.pk !== viewingUser.data?.id && (
        <>
          <p>You are {viewingUser.data?.following_user ? "" : "not "}following this user</p>
          <button type="button" onClick={viewingUser.data?.following_user ? handleUnfollow : handleFollow}>
            {viewingUser.data?.following_user ? "Unfollow" : "Follow"}
          </button>
        </>
      )}
      <Outlet />
    </>
  );
}
