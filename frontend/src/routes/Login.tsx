import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../App";

type LoginType = {
  username: string,
  password: string,
}

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: LoginType) => {
      console.log('login mutationFn fired')
      return await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log('login mutation success')
      queryClient.invalidateQueries({queryKey: ['user']})
      navigate("/home")
    }
  })

  async function handleLogin(data: LoginType) {
    console.log('handleData login fired')
    console.log('cancel user queries')
    await queryClient.cancelQueries({ queryKey: ['user'], exact: true })
    mutation.mutate(data)
    console.log("handle login");
  }

  return (
    <>
      <title>Cannoli | Login</title>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register("username", { required: true })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
        />

        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" value="Login" />
      </form>
      <p>Need an account? <Link to={"/register"}>Register</Link></p>
    </>
  );

}
