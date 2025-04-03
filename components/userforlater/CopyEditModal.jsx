import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react"; // Chakra UI components- modal form
import PropTypes from "prop-types";

export const CopyEditModal = ({ event, onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state
  const [editedEvent, setEditedEvent] = useState({ ...event });

  // Handle changes(Edited info)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle to save the changes
  const handleSave = () => {
    onSave(editedEvent);
    onClose(); // Pass the updated event to the onSave function (which updates it in the backend)
  };

  return (
    <div className="Editmodal">
      {/* Button to open the modal */}

      <Button colorScheme="pink" onClick={onOpen}>
        CopyEditModalButton
      </Button>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>A. CopyEditModal Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onChange={handleChange}>
              <FormControl>
                <FormLabel>
                  Created By: need to convert the createdByID into userName
                </FormLabel>
                <FormLabel>or checkout how i get the creators name.</FormLabel>
                <Input
                  type="text"
                  name="created.by"
                  value={editedEvent.createdBy}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description-rewrite onChange</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={editedEvent.description}
                  onChange={(e) =>
                    setEditedEvent((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>image</FormLabel>
                <Input
                  type="url"
                  name="image"
                  value={editedEvent.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  V1 Category: need to add dropdown / selected menu as
                  AddEventModal
                </FormLabel>
                <Input
                  type="text"
                  name="categories"
                  value={editedEvent.categoryNames}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  type="text"
                  name="location"
                  value={editedEvent.location}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Start date and Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="starttime"
                  value={editedEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>End date and Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="endtime"
                  value={editedEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Add other fields for editing the event here */}
              <Button colorScheme="blue" onClick={handleSave} mt={4} mr={4}>
                {" "}
                Save Changes
              </Button>

              <Button colorScheme="purple" onClick={onClose} mt={4} mr={4}>
                Cancel
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

// PropTypes validation
CopyEditModal.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    // Add other properties that the event object might have
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
export default CopyEditModal;
