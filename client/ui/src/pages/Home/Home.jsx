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

const Home = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [allMails, setAllMails] = useState([]);
  const profile=JSON.parse(localStorage.getItem("user"))
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxRes, setMaxRes] = useState(25);
  const [fetchCatTrigger, setFetchCatTrigger]= useState(false)
  const [nextPToken, setNextPToken] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullMailView, setFullMailView] = useState("");
  const mailsPerPage = 5;
  const navigate = useNavigate();
  const {aiResponse, aiError, aiLoading, getEmailsClassified}= useGoogleAI();

  useEffect(() => {
    fetchMailList() 
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
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${(maxRes-allMails.length)}&includeSpamTrash=true${nextPToken?("&pageToken="+nextPToken):""}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      response.data.nextPageToken && setNextPToken(response.data.nextPageToken)
      const mailList = response.data.messages;
      await fetchAllMails(mailList);
    } catch (error) {
      console.log(error.response.data.error.code)
      setError(error.response.data.error.code);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (mails) => {
     getEmailsClassified(
      localStorage.getItem("googleAIApiKey"),
      mails, aiResponse
    );
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
      setAllMails(p=>p.concat(messageDetails));
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
   const newPCnt = Math.ceil(newValue/mailsPerPage)
   setPageCount(newPCnt);
   currentPage>newPCnt && setCurrentPage(newPCnt);
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
    if(error==401) logOut();
    return <div className="homeContainer">Oops, something went wrong.</div>;
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
        <Slider min={1} max={allMails.length + 25} value={maxRes} aria-label="Maximum Results" valueLabelDisplay="auto" onChange={(event, newValue) => setMaxRes(newValue)}
        onChangeCommitted={handleSliderChangeCommitted} disabled={aiLoading || aiError} />
         <Typography color="primary" variant="subtitle2" component="h1" sx={{width:'100px'}}>{aiLoading|| aiError ? "wait.." : (maxRes+" Results")}</Typography>
        </div>
        
        </div>

      <div className="mailSnippets">
        {allMails.slice(0,maxRes).slice((currentPage - 1) * mailsPerPage, (currentPage - 1) * mailsPerPage + mailsPerPage).map((message, index) => (
          <div key={message.id} onClick={()=>setFullMailView(message.id)}>
            <MailSnippetCard
              subject={message.subject}
              snippet={message.snippet}
              category={getSingleCategory(message.id)}
              date={message.date}
              setTrigger={setFetchCatTrigger}
            />
          </div>
        ))}
      </div>

      <Pagination totalPages={pageCount} currentPage={currentPage} onPageChange={handlePageChange} />

      {fullMailView &&   <EmailViewer mail={allMails.find(m=>m.id===fullMailView)} open={fullMailView?true:false} handleClose={()=>setFullMailView("")}/> }

      </div>
    </div>
  );
};

export default Home;
