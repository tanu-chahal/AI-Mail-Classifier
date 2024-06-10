import { useState, useEffect } from "react";
import axios from "axios";
import EmailViewer from "../../components/EmailViewer/EmailViewer";
import parseMessage from "gmail-api-parse-message";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useGoogleAI} from "../../utils/geminiAI";
import MailSnippetCard from "../../components/MailSnippetCard/MailSnippetCard";
import Button from "../../components/Button/Button";
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import Pagination from '../../components/Pagination/Pagination';
import Divider from '@mui/material/Divider';

const Home = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [allMails, setAllMails] = useState([]);
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxRes, setMaxRes] = useState(30);
  const [fetchCatTrigger, setFetchCatTrigger]= useState(false)
  const [categories, setCategories] = useState();
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const mailsPerPage = 5;
  const navigate = useNavigate();
  const {aiResponse, aiError, aiLoading, getEmailsClassified}= useGoogleAI()

  useEffect(() => {
    // console.log(allMails)
    fetchMailList() 
    // if (!aiResponse && allMails) {
    //   fetchCategories(allMails);
    // }
    setPageCount(Math.ceil(maxRes / mailsPerPage))
  }, []);

  useEffect(()=>{
    if(fetchCatTrigger){ 
      fetchCategories(allMails)
      setFetchCatTrigger(false)
    }
  },[fetchCatTrigger])

  const fetchMailList = async () => {
    try {
      console.log(accessToken)
      const nextPToken = localStorage.getItem('nextPageToken')
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxRes}&includeSpamTrash=true${nextPToken?("&pageToken="+nextPToken):""}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      response.data.nextPageToken && localStorage.setItem('nextPageToken', response.data.nextPageToken)
      const mailList = response.data.messages;
      await fetchAllMails(mailList);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(()=>{console.log("allMails: "+allMails)},[allMails])

  const fetchCategories = async (mails) => {
    // let cats = undefined;
    // while (!cats) {
     getEmailsClassified(
      localStorage.getItem("googleAIApiKey"),
      mails
    );
    // cats && setCategories(cats);
    // cats && localStorage.setItem("allCategories", JSON.stringify(cats));
    // }
  };

  const fetchAllMails = async (messageList) => {
    console.log("fetchAllMails")
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
            sender: parsedMessage.headers.sender,
            to: parsedMessage.headers.to,
            subject: parsedMessage.headers.subject,
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
      fetchCategories(messageDetails);
      setAllMails(messageDetails);
      // localStorage.setItem("allMails", JSON.stringify(messageDetails));
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

  const handleSliderChangeCommitted = (event, newValue) => {
    setMaxRes(newValue);
    if(newValue>=allMails.length){
      fetchMailList()
   }
   setPageCount(Math.ceil(newValue/mailsPerPage));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getSingleCategory = (msgID)=>{
    if(aiLoading){
      return "writing.."
    }else if(aiError){
      return "Retry"
    }else{
      return aiResponse[msgID]
    }
  }

  if (loading) {
    return <div className="homeContainer">Loading...</div>;
  }

  if (error) {
    return <div className="homeContainer">Error: {error}</div>;
  }


  return (
    <div className="homeContainer">
      
      <div className="header">
        <div className="profileOfUser">
          <img className="profilePic" src={profile.picture} alt="user image" />
          <div>
            <Typography color="white" variant="h6" component="h1">
              {profile.name}
            </Typography>
            <Typography color="primary" variant="subtitle3" component="h1">
              {profile.email}
            </Typography>
          </div>
        </div>
        <Button onClick={logOut}>Log Out</Button>
      </div>

      <div className="mailsSection">

        <div className="mailsSectionHeader">
        <Typography color="primary" variant="h3" component="h1">Gmail Messages</Typography>
        <div className="maxResultsSlider">
        <Slider value={maxRes} aria-label="Maximum Results" valueLabelDisplay="auto" onChange={(event, newValue) => setMaxRes(newValue)}
        onChangeCommitted={handleSliderChangeCommitted} />
         <Typography color="primary" variant="subtitle2" component="h1" sx={{width:'100px'}}>{maxRes} Results</Typography>
        </div>
        
        </div>

      <div className="mailSnippets">
        {allMails.slice(0,maxRes).slice((currentPage - 1) * mailsPerPage, (currentPage - 1) * mailsPerPage + mailsPerPage).map((message, index) => (
          <div key={message.id}>
            <MailSnippetCard
              subject={message.subject}
              snippet={message.snippet}
              // category={categories ? categories[message.id] : "Retry"}
              category={getSingleCategory(message.id)}
              date={message.date}
              setTrigger={setFetchCatTrigger}
            />
            {/* <p>
            <strong>Message ID:</strong> {message.id}
          </p>
          <p>
            <strong>Subject:</strong> {message.subject}
          </p>
          {categories && (
            <h1 className="category">Category: {categories[message.id]}</h1>
          )}
          <p>{message.textPlain}</p>
         
          <EmailViewer htmlContent={message.htmlBody} />
        */}
          </div>
        ))}
      </div>

      <Pagination totalPages={pageCount} currentPage={currentPage} onPageChange={handlePageChange} />

      </div>
    </div>
  );
};

export default Home;
