import React from 'react';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteEventConfirmationModel.css";

function DeleteEventConfirmationModel({ onConfirm, onCancel }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };


  return (
    <div className="delete-confirmation-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this item?</p>
      <div className="delete-buttons">
        <button onClick={handleDelete} className="delete-button2">
          Yes(Delete Group)
        </button>
        <button onClick={handleCancel} className="cancel-button">
          No(Keep Group)
        </button>
      </div>
    </div>
  );
};

export default DeleteEventConfirmationModel;
