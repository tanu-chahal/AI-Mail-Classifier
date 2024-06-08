import { useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      localStorage.setItem('accessToken', codeResponse.access_token);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/gmail.readonly"
  });

  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    localStorage.clear();
    console.log("Logged Out!");
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data)
          localStorage.setItem('user', JSON.stringify(res.data));
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div>
      <button onClick={login}>O-Auth Login</button>
      <button onClick={logOut}>Log out</button>

      {profile && (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>Our User</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default Login;
