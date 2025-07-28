import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API } from '../utils/api'; 

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`${API}/api/auth/verify-email?token=${token}`) 
        .then(response => {
          console.log(response.data); 

          if (response.data.isVerified) {
            alert('Email successfully verified!');
          }

          navigate('/login'); 
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
