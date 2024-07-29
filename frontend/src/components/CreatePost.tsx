import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const postMutation = useMutation({
    mutationFn: async (data) => {
      console.log("create post mutationFn fired");
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
      console.log("create post mutation success");
    },
  });

  function handleCreatePost(data) {
    console.log("handle post post");
    postMutation.mutate(data);
  }

  return (
    <div>
      <Form.Root onSubmit={handleSubmit(handleCreatePost)}>
        <Form.Field name="content">
          <Form.Label>Post</Form.Label>
          <Form.Control asChild>
            <textarea
              id="content"
              placeholder="Write your reply"
              {...register("content", {
                required: true,
                maxLength: {
                  value: 256,
                  message: "Max of 256 characters",
                },
              })}
            />
          </Form.Control>
          <Form.Message asChild>
            <p>{errors.content?.message}</p>
          </Form.Message>
        </Form.Field>
        <Form.Submit>Post</Form.Submit>
      </Form.Root>
    </div>
  );
}
