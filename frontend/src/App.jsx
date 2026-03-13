import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import History from "./pages/History" 
import LandingLayout from "./layouts/LandingLayout"
import AuthLayout from "./layouts/AuthLayout"

import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"
import Analytics from "./pages/Analytics"

import { useAuthStore } from "./store/authStore"

function App() {

 const { accessToken, setAuth } = useAuthStore()

 useEffect(() => {

  const refreshLogin = async () => {

   try {

    const res = await axios.post(
     "http://localhost:5000/api/auth/refresh",
     {},
     { withCredentials: true }
    )

    setAuth(res.data.accessToken, res.data.user)

   } catch {
    console.log("Not logged in")
   }

  }

  refreshLogin()

 }, [setAuth])



 const ProtectedRoute = ({ children }) => {

  if(!accessToken){
   return <Navigate to="/login"/>
  }

  return children

 }



 return (

  <BrowserRouter>

   <Routes>

    {/* LANDING PAGE */}
    <Route element={<LandingLayout/>}>
     <Route path="/" element={<LandingPage/>}/>
    </Route>



    {/* LOGIN */}
    <Route element={<AuthLayout/>}>
     <Route path="/login" element={<AuthPage/>}/>
    </Route>



    {/* DASHBOARD */}
    <Route
     path="/dashboard"
     element={
      <ProtectedRoute>
       <Dashboard/>
      </ProtectedRoute>
     }
    />



    <Route
     path="/analytics"
     element={
      <ProtectedRoute>
       <Analytics/>
      </ProtectedRoute>
     }
    />

    {/* HISTORY PAGE */}
    <Route
     path="/history"
     element={
      <ProtectedRoute>
       <History/>
      </ProtectedRoute>
     }
    />

   </Routes>

  </BrowserRouter>

 )

}

export default App