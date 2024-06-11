import React from 'react'
import { useNavigate} from "react-router-dom"
import './NoMatch.css'
import Typography from "@mui/material/Typography";

const NoMatch = () => {
    const navigate = useNavigate();
  return (
    <div className="noMatchContainer">
        <div className="noMatchContent">
        <Typography
            color="white"
            variant="h5"
            component="h2"
            sx={{ fontWeight: 400 }}
          >
           Oops! looks like you got lost.
          </Typography>
          <Typography
            color="white"
            variant="h5"
            component="h2"
            sx={{ fontWeight: 400 }}
          >
              Go back home by clicking <Typography color="primary" sx={{textDecoration: 'underline', display:'inline'}} onClick={()=>navigate("/home")}>here</Typography>.
            </Typography>
        </div>
            
    </div>
  )
}

export default NoMatch