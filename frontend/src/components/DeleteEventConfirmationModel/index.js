
import React from 'react';

const DeleteEventConfirmationModel = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Yes (Delete Event)
          </button>
          <button onClick={onCancel} className="cancel-button">
            No (Keep Event)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventConfirmationModel;
