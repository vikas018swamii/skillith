import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API } from '../utils/api'; // Import your API constant

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      // Make a request to your backend API to verify the token
      axios
        .get(`${API}/api/auth/verify-email?token=${token}`) // use full API path
        .then(response => {
          console.log(response.data); // Log the response data for debugging

          // If isVerified is true, show success message
          if (response.data.isVerified) {
            alert('Email successfully verified!');
          }

          navigate('/login');  // Redirect to login page after successful verification
        })
        .catch(error => {
          alert(error.response?.data || 'Verification failed');
        });
    }
  }, [token]);

  return (
    <div>
      <h2>Verifying your email...</h2>
    </div>
  );
}

export default VerifyEmail;
