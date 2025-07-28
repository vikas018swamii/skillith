import styles from './DeleteAccount.module.css';
import { API } from '../utils/api';

const DeleteAccount = () => {
  const handleRequestDelete = async () => {
    const confirmDelete = window.confirm("A confirmation email will be sent. Proceed?");
    if (!confirmDelete) return;

    try {
      console.log("Token before request:", localStorage.getItem('token'));

      const res = await fetch(`${API}/api/auth/request-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Confirmation email sent.');
      } else {
        alert(data.message || 'Failed to send email.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Delete Your Account</h2>
        <p className={styles.description}>
          We'll send a confirmation email. You must click the link in that email to complete deletion.
        </p>
        <button onClick={handleRequestDelete} className={styles.button}>
          Send Confirmation Email
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
