export async function fetchRefresh(url: string, options: object) {
  let res = await fetch(url, options);

  if (res.status === 401) {
    await refreshTokens();

    // With refresh token rotation active in backend, need to
    // overwrite header in backup attempt with updated access
    // token, otherwise outdated token originally passed to
    // fetchWithRefresh would be used
    res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      throw new Error("Refresh token expired");
    }

    console.log("Success after token refresh");
    return res;
  }

  console.log("Success");
  return res;
}

export async function refreshTokens() {
  await fetch("http://127.0.0.1:8000/auth/token/refresh/", {
    method: "POST",
    body: JSON.stringify({
      refresh: localStorage.getItem("refresh"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      } else {
        console.log('no access/refresh token returned, skipping')
      }
    })
    .catch((err) => console.error(err));
}
