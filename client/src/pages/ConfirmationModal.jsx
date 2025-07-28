import styles from "./ConfirmationModal.module.css";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>Are you sure you want to delete this chat?</p>
        <div className={styles.modalButtons}>
          <button className={styles.btnCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.btnConfirm} onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
