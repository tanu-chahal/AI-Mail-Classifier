import { useState, useEffect } from "react";
import axios from "axios";
import EmailViewer from "../../components/EmailViewer/EmailViewer";
import parseMessage from 'gmail-api-parse-message';
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Home.css"
import { useOpenAIApi } from "../../../openAIConnect";
import { getEmailsClassified } from "../../../geminiAI";

const Home = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [allMails, setAllMails] = useState( JSON.parse(localStorage.getItem('allMails'))) 
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxRes, setMaxRes] = useState(10);
  const [categories, setCategories] = useState([])
  const navigate = useNavigate();
  const { response, catErr, catLoading, callOpenAI } = useOpenAIApi();

  useEffect(() => {
    const fetchMailList = async () => {
      try {
        const response = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxRes}&includeSpamTrash=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log(response.data);
        const mailList = response.data.messages;
        await fetchAllMails(mailList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    !allMails ? fetchMailList() : setLoading(false);
    // localStorage.getItem('openAIApiKey') && setCategories[getEmailsClassified(allMails)];
    const messages = "what color is the sky? ai amor ai amor"
   getEmailsClassified(localStorage.getItem('openAIApiKey') || "", messages);
  }, []);
 
  const fetchAllMails = async (messageList) => {
    const messageDetails = [];
    try {
      const fetchPromises = messageList.map(async (message) => {
        try {
          const messageResponse = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          const parsedMessage = parseMessage(messageResponse.data);
          messageDetails.push({
            id: parsedMessage.id,
            threadId: parsedMessage.threadId,
            sender:parsedMessage.headers.sender,
            to: parsedMessage.headers.to,
            subject:parsedMessage.headers.subject,
            labels: parsedMessage.labelIds,
            date: parsedMessage.headers.date,
            htmlBody: parsedMessage.textHtml,
            textBody: parsedMessage?.textPlain || "",
            snippet: parsedMessage.snippet,
          });
        } catch (error) {
          console.error(`Error fetching message: ${error.message}`);
        }
      });

      await Promise.all(fetchPromises);
  
      setAllMails(messageDetails);
      localStorage.setItem("allMails", JSON.stringify(messageDetails));
    } catch (error) {
      setError(error.message);
    }
  };

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    console.log("Logged Out!");
    navigate("/");
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="homeContainer">
      <button onClick={logOut}>Log Out</button>
    <h2>Gmail Messages</h2>
    {allMails.map((message, index) => (
      <div key={index}>
        <p><strong>Message ID:</strong> {message.id}</p>
        <p><strong>Subject:</strong> {message.subject}</p>
        <p>{message.textPlain}</p>
        <EmailViewer htmlContent={message.htmlBody} />
        <hr />
      </div>
    ))}
  </div>
  );
};

export default Home;
