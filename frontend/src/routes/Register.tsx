import { useNavigate, Link } from "react-router-dom";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as Form from "@radix-ui/react-form";
import Welcome from "../components/Welcome";
import styles from "./Register.module.css";

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
    watch,
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
      <Welcome />
      <h2>Register</h2>
      <Form.Root
        onSubmit={handleSubmit(handleRegister)}
        className={styles.root}
      >
        <Form.Field name="email" className={styles.field}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.email?.message}</p>
          </Form.Message>
        </Form.Field>
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
        <Form.Field name="password1" className={styles.field}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            {...register("password1", {
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.password1?.message}</p>
          </Form.Message>
        </Form.Field>
        <Form.Field name="password2" className={styles.field}>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            {...register("password2", {
              required: {
                value: true,
                message: "Password confirmation is required",
              },
              validate: (value: string) => {
                if (watch("password1") !== value) {
                  return "Passwords must match"
                }
              },
            })}
          />
          <Form.Message asChild className={styles.error}>
            <p>{errors.password2?.message}</p>
          </Form.Message>
        </Form.Field>
        <Form.Submit className={styles.registerButton}>Register</Form.Submit>
      </Form.Root>

      <p>Already registered? <Link to={"/login"} className={styles.link}>Login</Link></p>
    </>
  );
}
