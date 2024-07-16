import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import "./App.css";

export default function App() {
  const [user, setUser] = useState()
  const [profile, setProfile] = useState()
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleRefreshToken() {
    await fetch("http://127.0.0.1:8000/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({
        refresh: localStorage.getItem("refresh"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      })
      .catch((err) => console.log(err));
  }

  async function handleCheckUser() {
    if (!localStorage.getItem("refresh")) return;

    let res = await fetch("http://127.0.0.1:8000/auth/user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    let resJson = await res.json();

    if (res.status === 200) {
      console.log(`OK: ${res.status}`);
    } else if (res.status === 401) {
      console.log(`401 Error! ${res.status}`);
      console.log("Refreshing token...");
      await handleRefreshToken();
      res = await fetch("http://127.0.0.1:8000/auth/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      resJson = await res.json();
      console.log("token refreshed, original req resent");
    }

    setUser(resJson)
  }

  async function handleGetProfile() {
    console.log(`http://127.0.0.1:8000/profiles/${user.pk}/`)
    await fetch(`http://127.0.0.1:8000/profiles/${user.pk}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setProfile(data)
      })
      .catch((err) => console.log(err));
  }

  async function handleEditProfile() {
    await handleGetProfile()
    setIsEditingProfile(true)
    console.log(profile)
  }

  async function handlePutProfile(data: FieldValues) {
    await fetch(`http://127.0.0.1:8000/profiles/${user.pk}/`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        update_date: new Date().toISOString(),
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setIsEditingProfile(false)
      })
      .catch((err) => console.log(err));
  }

  function handleCancelEditProfile() {
    setIsEditingProfile(false)
  }

  async function handleLogout() {
    if (!localStorage.getItem("refresh")) return;

    console.log(localStorage.getItem("refresh-token"));
    await fetch("http://127.0.0.1:8000/auth/token/blacklist/", {
      method: "POST",
      body: JSON.stringify({
        refresh: localStorage.getItem("refresh"),
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <RegisterForm />
      <LoginForm />
      
      <button type="button" onClick={handleEditProfile}>
        Edit Profile
      </button>
      <button type="button" onClick={handleRefreshToken}>
        Refresh Token
      </button>
      <button type="button" onClick={handleCheckUser}>
        Check User
      </button>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      {isEditingProfile && (
        <>
          <form onSubmit={handleSubmit(handlePutProfile)}>
            <label htmlFor="about">About</label>
            <textarea
              id="about"
              defaultValue={profile.about}
              {...register("about", { required: false })}
            />

            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" value="Save Changes" />
          </form>
          <button type="button" onClick={handleCancelEditProfile}>Cancel</button>
        </>
      )}
    </>
  );
}
