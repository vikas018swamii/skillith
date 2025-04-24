import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';

const DeleteConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteAccount = async () => {
      try {
        const res = await fetch(`${API}/api/auth/delete-confirm/${token}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || 'Account deleted.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          alert(data.message || 'Invalid or expired link.');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      }
    };

    deleteAccount();
  }, [token, navigate]);

  return (
    <div className="text-center mt-10 text-lg font-semibold">
      Processing your request...
    </div>
  );
};

export default DeleteConfirm;
