import React, { useState, useEffect } from "react";
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
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export const TestEditForm = ({ editEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state

  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Handle changes (Edited info)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle to save the changes
  const handleSave = () => {
    editEvent(editedEvent); // Pass the updated event to the onSave function (which updates it in the backend)
    onClose(); // Close modal
  };

  // Fetch categories and users from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      {/* Button to open the modal */}
      <Button colorScheme="purple" onClick={onOpen}>
        Edit Event
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormControl>
                <FormLabel>Creator</FormLabel>
                <Select
                  name="createdBy"
                  value={editedEvent.createdBy}
                  onChange={handleChange}
                  placeholder="Select creator"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  type="text"
                  value={editedEvent.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  type="text"
                  value={editedEvent.description}
                  onChange={handleChange}
                  placeholder="Enter short description"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Event Image</FormLabel>
                <Input
                  name="image"
                  type="url"
                  value={editedEvent.image}
                  onChange={handleChange}
                  placeholder="Enter URL for event image"
                />
              </FormControl>

              {/* Category Dropdown */}
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  name="categoryNames"
                  multiple
                  value={editedEvent.categoryNames}
                  onChange={handleChange}
                  placeholder="Select category/categories"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Display selected categories */}
              <FormControl>
                <FormLabel>Selected Categories</FormLabel>
                <Input
                  type="text"
                  value={
                    Array.isArray(editedEvent.categoryNames)
                      ? editedEvent.categoryNames.join(", ")
                      : ""
                  }
                  isReadOnly
                  placeholder="Selected categories will appear here"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Event Location</FormLabel>
                <Input
                  name="location"
                  type="text"
                  value={editedEvent.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Start date and time</FormLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={editedEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>End date and time</FormLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={editedEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>

              <Button colorScheme="pink" mt={4} onClick={handleSave}>
                Save Changes
              </Button>

              <Button colorScheme="yellow" mt={4} onClick={onClose}>
                Cancel
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

// Prop validation
TestEditForm.propTypes = {
  editEvent: PropTypes.func.isRequired, // editEvent is a function to edit the event
  event: PropTypes.object.isRequired, // event is the event being edited
};

export default TestEditForm;
