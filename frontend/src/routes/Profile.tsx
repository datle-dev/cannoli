import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AuthContext } from "../App";
import { fetchRefresh } from "../utils/fetchUtils";

type ProfileType = {
  id: number,
  user_id: number,
  about: string,
  avatar: string,
  update_date: string,
}

export default function Profile() {
  const { user } = useContext(AuthContext)  

  const profile : UseQueryResult<ProfileType, Error>= useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetchRefresh(`http://127.0.0.1:8000/profiles/${user.data.pk}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      return res.json()
    },
    retry: 1,
  })
  
  if (profile.isPending) {
    return <p>Loading profile...</p>
  }

  if (!user.data) {
    console.log('redirect to login')
    return <Navigate to="/login" replace={true} />
  }

  if (profile.isError) {
    return <p>Error: {profile.error.message}</p>
  }

  return (
    <>
      <title>Cannoli | Profile</title>
      <p>{profile.data.about}</p>
      <p>{profile.data.avatar}</p>
      <p>{profile.data.update_date}</p>
    </>
  )

}
