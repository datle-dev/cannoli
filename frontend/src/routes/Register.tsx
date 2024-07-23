import { useNavigate, Link } from "react-router-dom";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

type RegisterType = {
  email: string,
  username: string,
  password1: string,
  password2: string,
}

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data: RegisterType) => {
      console.log('register mutationFn fired')
      return await fetch("http://127.0.0.1:8000/auth/registration/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (resData) => console.log(resData))
        .catch((err) => console.error(err));
    },
    onSuccess: () => {
      console.log('register mutation success')
      navigate("/login")
    }
  })

  const handleRegister: SubmitHandler<FieldValues> = async (data: RegisterType) => {
    console.log('handle register')
    mutation.mutate(data)
  };

  return (
    <>
      <title>Cannoli | Register</title>
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
      <p>Already registered? <Link to={"/login"}>Login</Link></p>
    </>
  );
}
