/// need to read tomorrow.
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
} from "@chakra-ui/react"; // Chakra UI components- modal form
import PropTypes from "prop-types"; // Import PropTypes
import { toast } from "react-toastify";

export const DraftCategory = ({ createEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hook to manage modal state

  const [newUser, setNewUser] = useState(""); // store new user name
  const [users, setUsers] = useState([]); // store users

  const [createdBy, setCreatedBy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryNames, setCategoryNames] = useState([]); // Store selected category ID
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categories, setCategories] = useState([]); // Store categories from the backend
  const [newCategoryName, setNewCategoryName] = useState("");
  

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories"); // Replace with your API endpoint
        const data = await response.json();
        setCategories(data); // Set the fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this will run once when the component mounts

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetch users");
        const users = await fetch("http://localhost:3000/users"); // Replace with your API endpoint
        console.log("Users response received", users);

        const usersJson = await users.json();
        console.log("Parsen users JSON", usersJson);

        setUsers(usersJson); // Set the fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEvent = {
      newUser,
      createdBy: parseInt(createdBy), // parseInt means to check the data if it is a number, otherwise : it is not a number.
      title,
      description,
      image,
      categoryIds: categoryNames.map((category) => parseInt(category)), // Use the IDs here
      location,
      startTime,
      endTime,
      newCategoryName,
    };
    // Call the parent function to create the event
    await createEvent(newEvent);

    // Reset the form fields
    setNewUser("");
    setCreatedBy("");
    setTitle("");
    setDescription("");
    setImage("");
    setCategoryNames([]);
    setNewCategoryName("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    onClose(); // Close the modal after submission
  };

  return (
    <div>
      {/* Button to open the modal */}
      <Button colorScheme="purple" onClick={onOpen}>
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
                {/* use existing users from backend data, use dropdown, user.id*/}
                <FormLabel>Creator selection</FormLabel>
                <Select
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  placeholder="Select creator"
                >
                  {/* Map through categories to create <option /> elements */}
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Input
                type="text"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="Enter your name"
              />

              <FormControl> test: creator name: </FormControl>
              <Input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="new creator"
              />
              {/*(users.map ((user)=> (
                <option key = {user.id} value= {user.name}>
                  {user.name}
                </option>
              ))} */}

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
              {/* Category Dropdown */}
              <FormControl isRequired>
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
                  {/* Map through categories to create <option /> elements */}
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
              <FormControl isRequired>
                <FormLabel>TEST Category</FormLabel>
                <Input
                  type="text"
                  value={categories.name}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="add new"
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
DraftCategory.propTypes = {
  createEvent: PropTypes.func.isRequired, // createEvent should be a function and is required
};

export default DraftCategory;
