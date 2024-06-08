import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GmailComponent from "./components/GmailComponent/GmailComponent";

function App() {
  const Layout = () => {
    return (
      <div className="App">
         <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <Outlet />
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
          path: "/mails",
          element: <GmailComponent />,
        },
        {
          path: "/home",
          element: <Home />,
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
