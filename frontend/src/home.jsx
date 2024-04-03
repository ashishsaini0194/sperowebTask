import React, { useEffect, useState } from "react";
import LoginForm from "./login";
import SignUp from "./signup";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (!JSON.parse(user)?.token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <p>You are logged in.</p>
      ) : (
        <>
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
          <SignUp />
        </>
      )}
    </div>
  );
}

export default Home;
