import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";
import { AuthContext } from "../App";
import Welcome from "../components/Welcome";
import styles from "./Login.module.css";

type LoginType = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: LoginType) => {
      console.log("login mutationFn fired");
      return await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      console.log("login mutation success");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/home");
    },
  });

  async function handleLogin(data: LoginType) {
    console.log("handleData login fired");
    console.log("cancel user queries");
    console.log(JSON.stringify(data));
    await queryClient.cancelQueries({ queryKey: ["user"], exact: true });
    mutation.mutate(data);
    console.log("handle login");
  }

  return (
    <>
      <title>Cannoli | Login</title>
      <Welcome />
      <h2>Login</h2>
      <Form.Root
        onSubmit={handleSubmit(handleLogin)}
        className={styles.root}
      >
        <Form.Field name="username" className={styles.field}>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.username?.message}</p>
          </Form.Message>
        </Form.Field>
        <Form.Field name="password" className={styles.field}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.password?.message}</p>
          </Form.Message>
        </Form.Field>
        <Form.Submit className={styles.loginButton}>Login</Form.Submit>
      </Form.Root>

      <p>
        Need an account? <Link to={"/register"} className={styles.link}>Register</Link>
      </p>
    </>
  );
}
