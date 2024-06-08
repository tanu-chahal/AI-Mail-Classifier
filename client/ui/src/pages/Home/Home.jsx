import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId="me"

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Gmail Profile Information</h2>
      <p>
        <strong>Email:</strong> {profileData.emailAddress}
      </p>
      <p>
        <strong>Messages Total:</strong> {profileData.messagesTotal}
      </p>
      <p>
        <strong>Threads Total:</strong> {profileData.threadsTotal}
      </p>
    </div>
  );
};

export default Home;
