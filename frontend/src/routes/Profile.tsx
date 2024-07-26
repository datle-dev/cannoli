import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AuthContext } from "../App";
import { fetchRefresh } from "../utils/fetchUtils";

type ProfileType = {
  id: number,
  user_id: number,
  username: string,
  about: string,
  avatar: string,
  update_date: string,
}

export default function Profile() {
  const routeParams = useParams()
  const { user } = useContext(AuthContext)

  const viewingUser = useQuery({
    queryKey: ["user", "viewing"],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/user/${routeParams.username}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })

  const profileId = viewingUser.data?.profile_id

  const profile: UseQueryResult<ProfileType> = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/profiles/${profileId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    enabled: !!profileId,
    retry: 1,
  })
  
  if (viewingUser.isPending) {
    return <p>Loading user...</p>
  }

  if (profile?.isPending) {
    return <p>Loading profile...</p>
  }

  if (!user.data) {
    console.log('redirect to login')
    return <Navigate to="/login" replace={true} />
  }

  if (viewingUser.isError) {
    return <p>Error: {viewingUser.error.message}</p>
  }

  if (profile.isError) {
    return <p>Error: {profile.error.message}</p>
  }

  return (
    <>
      <title>Cannoli | Profile</title>
      <p>id: {viewingUser.data.id}</p>
      <p>username: {viewingUser.data.username}</p>
      <p>profile id: {viewingUser.data.profile_id}</p>
      <p>about: {profile.data.about}</p>
      <p>avatar: {profile.data.avatar}</p>
      <p>update date: {profile.data.update_date}</p>
    </>
  )

}
