import React from 'react'
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import './MailSnippetCard.css'

const categoryColors = {
    Important: 'green',
    Promotions: 'yellow',
    Social: 'blue',
    Marketing: 'yellow',
    General: 'blue',
    Spam: 'red',
    Retry: 'red'
  };

const MailSnippetCard = ({subject, snippet, date, category, setTrigger}) => {
    const handleFetchCategory = () =>{
        if(category=="Retry"){
            setTrigger(true)
        }
    }
  return (
    <div>
        <Card variant="outlined" sx={{width: '100%', display:'flex', flexDirection:'column', p:5, gap:2, bgcolor:'inherit', borderColor:'white'}}>
        <div className="cardHeader">
            <div className="cardTitle">
            <Typography color="primary" variant="h5" component="h1" sx={{fontWeight:400}} title={subject}>
             {subject.length>50 ? subject.substring(0,50)+"...": subject}
        </Typography>
        <Typography color="secondary" variant="subtitle3" component="h1">
              {date.substring(0,25)}
            </Typography>
            </div>

        <Typography color={categoryColors[category] || "grey"} variant="h6" component="h1" sx={{fontWeight:400}} onClick={handleFetchCategory}>
             {category}
        </Typography>
        </div>  

        <Divider color="white"/>
        <Typography color="white" variant="subtitle2" component="h2">
             {snippet}
        </Typography>
        <span className="fullMailLink">...more</span>
        </Card>
    </div>
  )
}

export default MailSnippetCard