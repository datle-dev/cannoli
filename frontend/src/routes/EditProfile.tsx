import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRefresh } from "../utils/fetchUtils";
import styles from "./EditProfile.module.css";
import { AuthContext } from "../App";
import Spinner from "../components/Spinner";

export default function EditProfile() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const avatarPresets = [
    "-_-",
    ">w<",
    "T~T",
    "o3<",
    "q-q",
    "@m@",
    "•ω•",
    "^3^",
    "*o*",
    "=.=",
    ";O;",
  ];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const watchedLeftEye = watch("lefteye");
  const watchedMouth = watch("mouth");
  const watchedRightEye = watch("righteye");
  const watchAbout = watch("about");

  const userMe = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      console.log("user useQuery fired");
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/user/${user.data.username}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      return await res.json();
    },
    retry: 1,
  });

  const userMeProfileId = userMe.data?.profile_id;

  const profileMe = useQuery({
    queryKey: ["profile", "me", "edit"],
    queryFn: async () => {
      console.log("profile me edit useQuery fired");
      const res = await fetchRefresh(
        `http://127.0.0.1:8000/profiles/${userMe.data.profile_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      return await res.json();
    },
    enabled: !!userMeProfileId,
    retry: 1,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      console.log("update profile mutationFn fired");
      return await fetchRefresh(
        `http://127.0.0.1:8000/profiles/${profileMe.data.id}/`,
        {
          method: "PUT",
          body: JSON.stringify({
            about: data.about,
            avatar: data.lefteye + data.mouth + data.righteye,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    },
    retry: 1,
    onSuccess: () => {
      console.log("update profile mutation success");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      navigate(`/profile/${userMe.data.username}/posts`);
    },
  });

  function handleEditProfile(data) {
    console.log("handle edit profile");
    updateProfileMutation.mutate(data);
  }

  if (userMe.isPending || profileMe.isPending) {
    return <Spinner />;
  }

  function handleAssignAvatarPreset(e) {
    console.log(e.currentTarget.getAttribute("data-preset"))
    const chosenPreset = e.currentTarget.getAttribute("data-preset");
    setValue("lefteye", chosenPreset[0])
    setValue("mouth", chosenPreset[1])
    setValue("righteye", chosenPreset[2])
  }

  return (
    <>
      <title>Cannoli | Edit Profile</title>
      <h2>Edit Profile</h2>

      <Form.Root
        onSubmit={handleSubmit(handleEditProfile)}
        className={styles.root}
      >
        <Form.Field name="about" className={styles.field}>
          <Form.Label asChild>
            <h3>About</h3>
          </Form.Label>
          <Form.Control asChild>
            <textarea
              id="about"
              defaultValue={profileMe.data.about}
              {...register("about", {
                required: true,
                maxLength: {
                  value: 256,
                  message: "Max of 256 characters",
                },
              })}
            />
          </Form.Control>
          <p>{Number(watchAbout?.length)}/256</p>
          <Form.Message asChild className={styles.error}>
            <p>{errors.about?.message}</p>
          </Form.Message>
        </Form.Field>

        <h3>Avatar Preview</h3>
        <div className={styles.avatarPreview}>
          <p>{watchedLeftEye}</p>
          <p>{watchedMouth}</p>
          <p>{watchedRightEye}</p>
        </div>

        <Form.Field name="avatar" className={styles.field}>
          <Form.Label>Left Eye</Form.Label>
          <Form.Control
            type="text"
            defaultValue={profileMe.data.avatar[0]}
            className={styles.avatarTextInput}
            maxLength={1}
            {...register("lefteye", {
              required: {
                value: true,
                message: "Left eye is required",
              },
              minLength: {
                value: 1,
                message: "Left eye must be 1 character",
              },
              maxLength: {
                value: 1,
                message: "Left eye must be 1 character",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.lefteye?.message}</p>
          </Form.Message>
        </Form.Field>

        <Form.Field name="mouth" className={styles.field}>
          <Form.Label>Mouth</Form.Label>
          <Form.Control
            type="text"
            defaultValue={profileMe.data.avatar[1]}
            className={styles.avatarTextInput}
            maxLength={1}
            {...register("mouth", {
              required: {
                value: true,
                message: "Mouth is required",
              },
              minLength: {
                value: 1,
                message: "Mouth must be 1 character",
              },
              maxLength: {
                value: 1,
                message: "Mouth must be 1 character",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.mouth?.message}</p>
          </Form.Message>
        </Form.Field>

        <Form.Field name="righteye" className={styles.field}>
          <Form.Label>Right Eye</Form.Label>
          <Form.Control
            type="text"
            defaultValue={profileMe.data.avatar[2]}
            className={styles.avatarTextInput}
            maxLength={1}
            {...register("righteye", {
              required: {
                value: true,
                message: "Right eye is required",
              },
              minLength: {
                value: 1,
                message: "Right eye must be 1 character",
              },
              maxLength: {
                value: 1,
                message: "Right eye must be 1 character",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.righteye?.message}</p>
          </Form.Message>
        </Form.Field>

        <Form.Submit>Update Profile</Form.Submit>
      </Form.Root>
      
      <p>Avatar Presets</p>
      <div className={styles.avatarPresets}>
        {avatarPresets.map((preset, index) => {
          return <button type="button" data-preset={preset} onClick={handleAssignAvatarPreset}>{preset[0] + " " + preset[1] + " " + preset[2]}</button>
        })}
      </div>
    </>
  );
}
