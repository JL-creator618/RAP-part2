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
import PropTypes from "prop-types"; // Import PropTypes

export const EventFormModal = ({ createEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state

  const [createdBy, setCreatedBy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEvent = {
      createdBy,
      title,
      description,
      image,
      categoryIds,
      location,
      startTime,
      endTime,
    };
    // Call the parent function to create the event
    await createEvent(newEvent);

    // Empty the form fields
    setCreatedBy("");
    setTitle("");
    setDescription("");
    setImage("");
    setCategoryIds("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    onClose(); // Close the modal after submission
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button colorScheme="teal" onClick={onOpen}>
        Add New Event-Form
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Created by </FormLabel>
                <Input
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  placeholder="Enter your name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter short description"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Event Image</FormLabel>
                <Input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter URL or find it in https://www.pexels.com/"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  value={categoryIds}
                  onChange={(e) => setCategoryIds(e.target.value)}
                  placeholder="sports/games/relaxation"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Event location</FormLabel>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start date and time</FormLabel>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End date and time</FormLabel>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>

              <Button type="submit" colorScheme="teal" mt={4}>
                Add Event
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

// Prop validation
EventFormModal.propTypes = {
  createEvent: PropTypes.func.isRequired, // createEvent should be a function and is required
};
export default EventFormModal;
