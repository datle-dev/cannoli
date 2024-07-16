import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister: SubmitHandler<FieldValues> = async (data) => {
    await fetch("http://127.0.0.1:8000/auth/registration/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          {...register("email", { required: true })}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register("username", { required: true })}
        />

        <label htmlFor="password1">Password</label>
        <input
          type="password"
          id="password1"
          {...register("password1", { required: true })}
        />

        <label htmlFor="password2">Confirm Password</label>
        <input
          type="password"
          id="password2"
          {...register("password2", { required: true })}
        />

        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" value="Register" />
      </form>
    </>
  );
}
