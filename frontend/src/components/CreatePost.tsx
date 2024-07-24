import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function CreatePost() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log('create post mutationFn fired')
      return await fetch("http://127.0.0.1:8000/posts/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log('create post mutation success')
      // queryClient.invalidateQueries({queryKey: ['user']})
      // navigate("/home")
    }
  })

  function handlePostPost() {
    console.log('handle post post')
    mutation.mutate()
  }

  return (
    <article>
      <form onSubmit={handleSubmit(handlePostPost)}>
        <label htmlFor="content">Post</label>
        <textarea
          id="content"
          placeholder="Write your post"
          {...register("content", { required: true })}
        />

        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" value="Post" />
      </form>
    </article>
  );
}
