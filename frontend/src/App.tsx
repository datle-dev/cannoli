import { createContext } from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.tsx";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { fetchRefresh } from "./utils/fetchUtils.ts";

type UserType = {
  pk: number,
  username: string,
  email: string
}

export const AuthContext = createContext(null);

export default function App() {
  const user: UseQueryResult<UserType, Error> = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log('user useQuery fired')
      const res = await fetchRefresh("http://127.0.0.1:8000/auth/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })

      return await res.json()
    },
    retry: 1,
  });

  return (
    <>
      <AuthContext.Provider value={{ user }}>
        <RouterProvider router={Router} />
        <ReactQueryDevtools initialIsOpen={true} />
      </AuthContext.Provider>
    </>
  );
}
