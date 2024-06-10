import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GmailComponent from "./components/GmailComponent/GmailComponent";
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/theme.js';
import ProtectedRoute from "./utils/ProtectedRoute"

function App() {
  const Layout = () => {
    return (
      <div className="App">
         <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
         <ThemeProvider theme={theme}>
          <Outlet />
          </ThemeProvider>
         </GoogleOAuthProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children:[
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/home",
          element:<ProtectedRoute><Home /></ProtectedRoute>,
        },
      ]
    }
  ])

  return (
    <div>
     <RouterProvider router={router} />
    </div>
  )
}

export default App
