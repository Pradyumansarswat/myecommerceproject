import React from 'react';
import { Link } from 'react-router-dom'; 
import './style/Error.css'

const Error = () => {
  return (
   <>
     <div className="error-container">
      <nav className="breadcrumb">
        <span>Home</span> / <span>404 Error</span>
      </nav>

      <h1 className="error-title">404 Not Found</h1>

      <p className="error-message">
        Your visited page not found. You may go home page.
      </p>

      <Link to="/" className="home-button">
        Back to home page
      </Link>
    </div>
   </>
  )
}

export default Error