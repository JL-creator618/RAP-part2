import React, { useState, useEffect } from "react";
import { Heading, Box, Input, Select, Button } from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";

import { DraftCategory } from "../components/DraftCategory";

export const loader = async () => {
  try {
    //Fetch Users
    console.log("Fetch users");
    const users = await fetch("http://localhost:3000/users");
    console.log("Users response received", users);

    //Fetch events
    console.log("Fetch events");
    const events = await fetch("http://localhost:3000/events");
    console.log("Events response received", events);

    const usersJson = await users.json();
    console.log("Parsen users JSON", usersJson);

    const eventsJson = await events.json();
    console.log("Parson events JSON", eventsJson);

    // Fetch Categories
    console.log("Fetch categories...");
    const categories = await fetch("http://localhost:3000/categories");
    console.log("Categories response received", categories);

    const categoriesJson = await categories.json();
    console.log("Parsen categories JSON", categoriesJson);

    return { users: usersJson, events: eventsJson, categories: categoriesJson };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { users: [], event: [], categories: [] };
  }
};

export const EventsPage = () => {
  const { users, events, categories } = useLoaderData();
  const [newAddEvent, setNewAddEvent] = useState(events || []); // This will hold the events list
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [matchedEvents, setMatchedEvents] = useState([]); // State  to check searchquery with current events
  const [selectedCategory, setSelectedCategory] = useState(""); // state the selected- filter menu
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event for editing

  // Find the user once and store in a constant
  const user = users?.find((user) => events.createdBy === user.Id);

  // Function to handle event editing
  const editEventHandler = async (updatedEvent) => {
    const response = await fetch(
      `http://localhost:3000/events/${updatedEvent.id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedEvent),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      }
    );
    const editedEvent = await response.json();
    // Update the events list with the updated event
    setNewAddEvent((prevEvents) =>
      prevEvents.map((event) =>
        event.id === editedEvent.id ? editedEvent : event
      )
    );
  };

  //set filtermenu for categories
  const allCategories =
    categories.map((category) => category.name) || " category is not found";
  console.log("allcategories show:", allCategories);

  // Simple function to get category names from categoryIds
  const getCategoryNames = (categoryIds) => {
    // Check if categoryIds is an array
    if (!Array.isArray(categoryIds)) {
      return "Invalid category data"; // Return a fallback if it's not an array
    }
    return categoryIds
      .map((categoryId) => {
        // Find the category name based on categoryId
        const category = categories.find(
          (category) => category.id === categoryId
        );
        return category
          ? category.name
          : "Category just added (ID: " + categoryId + ")"; // Return category name or null if not found
      })
      .filter(Boolean) // Filter out any null values
      .join(", "); // Join the names with commas
  };

  useEffect(() => {
    let filteredEvents = events.filter((event) => {
      console.log("Searching for:", searchQuery);
      console.log("all events", events);

      // filter the event based on search query
      const searchEvent = event.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      console.log("print selected Category:", selectedCategory);

      //filter the events based on selected category
      const categoryMatches =
        selectedCategory === "" ||
        event.categoryIds.includes(parseInt(selectedCategory));

      return searchEvent && categoryMatches;
    });

    setMatchedEvents(filteredEvents); // not need to have setselectedCategory; it ends to infinity loop
  }, [searchQuery, selectedCategory, events]);

  // add EventForm
  const createEvent = async (newEvent) => {
    // No error handling, normally you would do that.
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    const createdEvent = await response.json(); // Get the event with the new id from the server
    setNewAddEvent((prevEvents) => [...prevEvents, createdEvent]); // Add the newly created event to the state
  };

  return (
    <div className="event-list">
      <Heading>List of events</Heading>
      <p>1. Category filter- OK</p>

      <Select
        placeholder="Select a Category"
        size="md"
        width="320px"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <p>2. Search bar - OK</p>
      <Box maxW="sm">
        <Input
          placeholder="Search for an event..."
          variant="outline"
          size="md"
          fontSize={"lg"}
          bgColor={"yellow"}
          focusBorderColor="purple.900"
          value={searchQuery} // Bind search input to state
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </Box>

      <p>3A Test new Eventform- VERY OK</p>
      <DraftCategory
        createEvent={createEvent}
        event={selectedEvent}
        editEvent={editEventHandler}
      />

      <p>4. overview of all events- OK</p>

      {newAddEvent && <p>{newAddEvent.name}</p>}

      {matchedEvents.map((event) => (
        <div key={event.id} className="event">
          <Link to={`event/${event.id}`}>
            <h2> Title: {event.title}</h2>
          </Link>
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              style={{ width: "300px", height: "300px", display: "flex" }}
            />
          ) : (
            <div
              style={{
                width: "300px",
                height: "300px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ccc",
                color: "#fff",
                fontSize: "16px",
              }}
            >
              No image available
            </div>
          )}
          <p>Description: {event.description}</p>
          <p>Start time: {event.startTime.slice(0, 19)} </p>
          <p>End time: {event.endTime.slice(0, 19)} </p>

          <p>
            Category:{" "}
            {event.categoryIds
              ? getCategoryNames(event.categoryIds)
              : "Not set categories"}
          </p>
          <p>
            created by:{" "}
            <Link to={`user/${user.name}`}>
              {users.find((user) => event.createdBy === user.id)?.name ||
                "User not found"}
            </Link>
          </p>
          <h3>
            OK Created by:{" "}
            <Link to={`user/${event.createdBy}`}>
              {users.find((user) => event.createdBy === user.id)?.name ||
                "User not found"}
            </Link>
          </h3>
          {/* Add Edit Button for each event- move to */}
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => setSelectedEvent(event)} // Set selected event for editing
          >
            Edit
          </Button>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default EventsPage;
