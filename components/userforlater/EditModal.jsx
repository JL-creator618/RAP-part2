import React, { useState } from "react";

import PropTypes from "prop-types";

export const EditModal = ({ event, onClose, onSave }) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedEvent); // Pass the updated event to the onSave function (which updates it in the backend)
  };

  return (
    <div className="modal">
      <h2>Edit Event</h2>
      <form>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={editedEvent.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={editedEvent.description}
            onChange={handleChange}
          />
        </div>
        {/* Add other fields for editing the event here */}
        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

// PropTypes validation
EditModal.propTypes = {
  createEvent: PropTypes.func.isRequired, // createEvent should be a function and is required
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    // Add other properties that the event object might have
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
export default EditModal;
