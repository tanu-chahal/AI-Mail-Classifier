import { useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Button from "../../components/Button/Button";
import Typography from "@mui/material/Typography";
import TextField from "../../components/TextField/TextField";

const Login = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [googleAIKey, setGoogleAIKey] = useState(
    localStorage.getItem("googleAIApiKey")
  );
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      localStorage.setItem("accessToken", codeResponse.access_token);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });

  const handleNavigation = () => {
    localStorage.setItem("googleAIApiKey", googleAIKey);
    navigate("/home");
  };

  const logOut = () => {
    googleLogout();
    setUser(null);
    setProfile(null);
    localStorage.clear();
    console.log("Logged Out!");
  };

  useEffect(() => {
    if (user) {
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
          localStorage.setItem("user", JSON.stringify(res.data));
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="Login">
      {!profile && <Button onClick={login}>O-Auth Login</Button>}

      {profile && (
        <div className="greetingContainer">
          <div className="userProfile">
            {" "}
            <Typography variant="h3" component="h2">
              Hello, {profile.given_name}
            </Typography>
            <img
              className="profilePic"
              src={profile.picture || "/assets/user-profile.svg"}
              alt="user image"
            />
          </div>

          <div className="apiKeyInput">
            <TextField
              id="outlined-basic"
              label="GoogleAI API Key"
              variant="outlined"
              value={googleAIKey}
              onChange={(event) => setGoogleAIKey(event.target.value)}
            />
            {googleAIKey && (
              <Button onClick={handleNavigation}>Classify Emails</Button>
            )}
            <Button onClick={logOut}>Log Out</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
