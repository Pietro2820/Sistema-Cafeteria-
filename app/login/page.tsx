"use client";

import LoginPanel from "./LoginPainel";

export default function Page() {
  return (
    <LoginPanel
      onSubmit={(email, password) => {
        // TODO: troque isso pela sua função de login já existente, ex:
        // await suaFuncaoDeLogin(email, password);
        console.log("login", email, password);
      }}
    />
  );
}