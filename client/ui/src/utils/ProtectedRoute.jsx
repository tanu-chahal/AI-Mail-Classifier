import React, {useState, useEffect} from 'react'
import {Navigate, useLocation} from "react-router-dom"
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({children}) => {
    const user = localStorage.getItem('user')
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [timeoutElapsed, setTimeoutElapsed] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setTimeoutElapsed(true);
        }, 5000);
        return () => clearTimeout(timeoutId);
      }, []);

  useEffect(() => {
    if (user || timeoutElapsed) {
      setLoading(false);
    }
  }, [user, timeoutElapsed]);

  if (loading) {
    return <div style={{height:"80vh", display:"flex", alignItems:"center", justifyContent:"center"}}><CircularProgress /></div>;
  }
  if(!user){
        return <Navigate to="/" state={{ path: location.pathname}}/>
  }
  return children; 
}

export default ProtectedRoute;