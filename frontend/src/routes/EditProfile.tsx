import { useState, useContext } from "react";
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

  const leftEyePresets = [
    "•",
    "*",
    "^",
    "o",
    "-",
    "=",
    ">",
    "T",
    ";",
    "q",
    "x",
  ];
  const rightEyePresets = [
    "•",
    "*",
    "^",
    "o",
    "-",
    "=",
    "<",
    "T",
    ";",
    "q",
    "x",
  ];
  const mouthPresets = [
    "ω",
    "w",
    "3",
    "-",
    "_",
    "o",
    "~",
    ".",
  ];
  const avatarPresets = [
    "-_-",
    ">w<",
    "T~T",
    "o3<",
    "q-q",
    "•ω•",
    "^3^",
    "*o*",
    "=.=",
    ";o;",
  ];

  const [leftEye, setLeftEye]  = useState("•");
  const [rightEye, setRightEye]  = useState("•");
  const [mouth, setMouth]  = useState("ω");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

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
            avatar: leftEye + mouth + rightEye,
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

  const watchAbout = watch("about");

  function handleEditProfile(data) {
    console.log("handle edit profile");
    updateProfileMutation.mutate(data);
  }

  if (userMe.isPending || profileMe.isPending) {
    return <Spinner />;
  }

  function handleAssignLeftEye(e) {
    const chosenLeftEye = e.currentTarget.getAttribute("data-left-eye");
    setLeftEye(chosenLeftEye);
  }

  function handleAssignRightEye(e) {
    const chosenRightEye = e.currentTarget.getAttribute("data-right-eye");
    setRightEye(chosenRightEye);
  }

  function handleAssignMouth(e) {
    const chosenMouth = e.currentTarget.getAttribute("data-mouth");
    setMouth(chosenMouth);
  }

  function handleAssignAvatarPreset(e) {
    console.log(e.currentTarget.getAttribute("data-preset"))
    const chosenPreset = e.currentTarget.getAttribute("data-preset");
    setLeftEye(chosenPreset[0]);
    setMouth(chosenPreset[1]);
    setRightEye(chosenPreset[2]);
  }

  return (
    <>
      <title>Cannoli | Edit Profile</title>
      <h2 className={styles.heading}>Edit Profile</h2>
      <Form.Root
        onSubmit={handleSubmit(handleEditProfile)}
        className={styles.formRoot}
      >
        <Form.Field name="about" className={styles.field}>
          <div className={styles.aboutTopRow}>
            <Form.Label asChild>
              <h3>About</h3>
            </Form.Label>
            <p>{Number(watchAbout?.length)}/256</p>
          </div>
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
              className={styles.aboutTextArea}
            />
          </Form.Control>
          <Form.Message asChild className={styles.error}>
            <p>{errors.about?.message}</p>
          </Form.Message>
        </Form.Field>

        <h3>Avatar Creator</h3>
        <p>
          Select a left eye, a mouth, and a right eye by clicking on the buttons below.
          Or select one of the presets with a preconfigured combination of eyes and a mouth.
        </p>
        <div className={styles.avatarCreator}>
          <div className={styles.avatarPreview}>
            <p>{leftEye}</p>
            <p>{mouth}</p>
            <p>{rightEye}</p>
          </div>
          <div className={styles.preset}>
            <h4>Left Eye</h4>
            <div className={styles.presetButtonGrid}>
              {leftEyePresets.map((preset, index) => {
                return <button type="button" data-left-eye={preset} onClick={handleAssignLeftEye} key={index}>{preset}</button>
              })}
            </div>
          </div>
          <div className={styles.preset}>
            <h4>Mouth</h4>
            <div className={styles.presetButtonGrid}>
              {mouthPresets.map((preset, index) => {
                return <button type="button" data-mouth={preset} onClick={handleAssignMouth} key={index}>{preset}</button>
              })}
            </div>
          </div>
          <div className={styles.preset}>
            <h4>Right Eye</h4>
            <div className={styles.presetButtonGrid}>
              {rightEyePresets.map((preset, index) => {
                return <button type="button" data-right-eye={preset} onClick={handleAssignRightEye} key={index}>{preset}</button>
              })}
            </div>
          </div>
          <div className={styles.avatarPresets}>
            <h4>Avatar Presets</h4>
            <div className={styles.avatarPresetButtonGrid}>
              {avatarPresets.map((preset, index) => {
                return <button type="button" data-preset={preset} onClick={handleAssignAvatarPreset} key={index}>{preset[0] + " " + preset[1] + " " + preset[2]}</button>
              })}
            </div>
          </div>
        </div>
        <Form.Submit className={styles.updateProfileButton}>Update Profile</Form.Submit>
      </Form.Root>
    </>
  );
}
