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
import { toast } from "react-toastify";

export const EditForm = ({ event, editEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state

  const [createdBy, setCreatedBy] = useState(event.createdBy || "");
  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [image, setImage] = useState(event.image || "");
  const [categoryNames, setCategoryNames] = useState(event.categoryIds || []);
  const [location, setLocation] = useState(event.location || "");
  const [startTime, setStartTime] = useState(event.startTime || "");
  const [endTime, setEndTime] = useState(event.endTime || "");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);


  /// test to see if it can be edited////
  /*
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
*/
  //// end of edit ///

  // Fetch categories from the backend
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

  ///// to add handlers to save and to retieve newEditinfo

  // Handle form submission (edit event)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedEvent = {
      createdBy: parseInt(createdBy), // Ensure the createdBy field is an integer
      title,
      description,
      image,
      categoryIds: categoryNames.map((category) => parseInt(category)),
      location,
      startTime,
      endTime,
    };

    // NEED TO FIX THIS// Call the parent function to edit the event
    await editEvent(updatedEvent);

    // Close the modal after submission
    // Reset the form fields
    setCreatedBy("");
    setTitle("");
    setDescription("");
    setImage("");
    setCategoryNames([]);
    setLocation("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button colorScheme="purple" onClick={onOpen}>
        EditFORM button
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>B.EditForm Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Creator</FormLabel>
                <Select
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
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
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter short description"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Event Image</FormLabel>
                <Input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter URL for event image"
                />
              </FormControl>

              {/* Category Dropdown */}
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  height={"100%"}
                  multiple
                  value={categoryNames}
                  onChange={(e) =>
                    setCategoryNames(
                      [...e.target.selectedOptions].map(
                        (option) => option.value
                      )
                    )
                  }
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
                  value={categoryNames.join(",")}
                  isReadOnly
                  placeholder="Selected categories will appear here"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Event location</FormLabel>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Start date and time</FormLabel>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>End date and time</FormLabel>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>

              <Button type="save" colorScheme="pink" mt={4} mr={4}>
                Save Changes
              </Button>

              <Button type="cancel" colorScheme="yellow" mt={4}>
                Cancle
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

// Prop validation
EditForm.propTypes = {
  editEvent: PropTypes.func.isRequired, // editEvent is a function to edit the event
  event: PropTypes.object.isRequired, // event is the event being edited
};

export default EditForm;
