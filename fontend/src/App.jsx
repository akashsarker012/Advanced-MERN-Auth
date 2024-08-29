import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import FloatingShape from "./components/FloatingShape";
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import SingUp from "./pages/SingUp";
import SingIn from "./pages/SingIn";
import VerifyEmail from "./pages/verifyEmail";
import { Toaster } from "react-hot-toast";

function App() {

  return(
    <div className='min-h-screen bg-gradient-to-br
  from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
    <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    },

    // Default options for specific types
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>
<FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
      <Routes>
        
        <Route path="/" element={<Home/>} />
        <Route path="sing-up" element={<SingUp/>} />
        <Route path="sing-in" element={<SingIn/>} />
        <Route path="verify-email" element={<VerifyEmail/>} />
      </Routes>
    
    </div>
  )
}

export default App;
