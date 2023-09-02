import React from 'react';
import './DeleteConfirmationModal.css'

const DeleteConfirmationModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="delete-confirmation-modal">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this group?</p>
      <button className="confirm-delete-button" onClick={onConfirm}>
        Yes (Delete Group)
      </button>
      <button className="cancel-delete-button" onClick={onCancel}>
        No (Keep Group)
      </button>
    </div>
  );
};

export default DeleteConfirmationModal;
