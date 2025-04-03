import React, { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { CopyEditModal } from "../components/userforlater/CopyEditModal";
import { EditModal } from "../components/userforlater/EditModal";
import { EditForm } from "../components/EditForm";
import { TestEditForm } from "../components/userforlater/TestEditForm";

export const loader = async ({ params }) => {
  try {
    // Fetch Users
    console.log("Fetch users...");
    const users = await fetch("http://localhost:3000/users");
    console.log("Users response received", users);

    const userJson = await users.json();
    console.log("Parsen users JSON", userJson);

    //Fetch Event
    console.log("Fetch eventItem...");
    const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
    console.log("EventItem response received", event);

    const eventJson = await event.json();
    console.log("Parson eventItem JSON", eventJson);

    // Fetch Categories
    console.log("Fetch categories...");
    const categories = await fetch("http://localhost:3000/categories");
    console.log("Categories response received", categories);

    const categoriesJson = await categories.json();
    console.log("Parsen categories JSON", categoriesJson);

    return { users: userJson, event: eventJson, categories: categoriesJson };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { users: [], event: [], categories: [] };
  }
};

export const EventPage = () => {
  const { event, users, categories } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false); // to store after edited event

  ///TEST if UseEffect is really needed & to see the console//
  const [newEditEvent, setNewEditEvent] = useState(event || []); // this is to hold the current eventlists
  const [newEvent, setNewEvent] = useState([]);

  useEffect(() => {
    console.log("fetch newEdit Event");
    // fetch the new edit event
    async function getEditEvent() {
      const amendEvent = await fetchNewEvent(); // assuning fetchNewEvent return a event
      setNewEvent(amendEvent);
    }
    getEditEvent();
  }, []);
  useEffect(() => {
    console.log("rendering ...");
  });

  ///end TEST code////

  // Toast//
  const notify = () => toast("Wow so easy!");

  // Find the user once and store in a constant
  const user = users?.find((user) => event.createdBy === user.id);
  console.log("print user:", user);

  // Access the image and handle its display
  const userImage = users.find((user) => event.createdBy === user.id)?.image;
  console.log("print userImage:", userImage);

  //Show CategryNames
  const categoryNames = [];
  event.categoryIds.forEach((categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    if (category && category.name) {
      categoryNames.push(category.name);
    }
    console.log("category names:", categoryNames);
  });

  // Function to handel event editing (on current event)
  const reEditEventHandler = async (editedEvent) => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/${editedEvent.id}`,
        {
          method: "PATCH", // patch for partial update
          body: JSON.stringify(editedEvent),
          headers: { "Content-Type": "application/json;charset=utf-8" },
        }
      );
      console.log("print response on reEditEventHandler", response);

      if (response.ok) {
        //  check if the respose is ok
        const updatedEvent = await response.json();
        setNewEditEvent(updatedEvent); // update local state with the new updated event
        setIsModalOpen(false); //close the modla after the event has been updated
        toast.success("Event updated is succesfully!");
        console.log("updatedEvent:", updatedEvent);
      } else {
        //if the response is not ok, log the status and body for debuggging
        const errorData = await response.json();
        console.error("Fail to update event:", response.status, errorData);
        toast.error("Failed to update event");
      }
    } catch (error) {
      // cathc network errors or any other issues
      console.error("Error while updating event:", error);
    }
    console.log("print reEditEventHandler:", reEditEventHandler);
  };

  return (
    <div className="even-detail">
      <Heading>Event Item Details:</Heading>

      <p>1. All details of selected event - OK</p>

      <p>2A. EditModalform- todo</p>
      {isModalOpen && (
        <EditModal
          newEditEvent={newEditEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={reEditEventHandler}
        />
      )}
      <p>
        2B. Edit CopyEditModal- creator & categories& timedate are not working &
        saveing, but save remaining
      </p>
      <CopyEditModal
        event={newEditEvent}
        onClose={() => setIsModalOpen(false)}
        onSave={reEditEventHandler}
      />
      <p>
        2C. Edit EditForm- creator& categories & timedate are working, but
        totally NOT save anything
      </p>
      <EditForm
        event={newEditEvent}
        onClose={() => setNewEditEvent(false)}
        onSave={reEditEventHandler}
      />
      <p> TEST EDITFORM</p>
      <TestEditForm
        event={newEditEvent}
        onClose={() => setNewEditEvent(false)}
        onSave={reEditEventHandler}
      />

      <p>3. toast-message on success or on failure- </p>
      <p>Delete button - xx</p>
      <p>4. Delete warning msg + confirmation- </p>
      <p>5. Redirect the user back to eventspage-</p>
      <Link to={`users/${users.id}`}>
        <h1>Title: {event.title}</h1>
      </Link>
      <Link to={`user/${event.createdBy}`}>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
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
              color: "#ffg",
              fontSize: "16px",
            }}
          >
            No image available
          </div>
        )}
      </Link>
      <p>Description: {event.description}</p>
      <p>Start time: {event.startTime} </p>
      <p>End time: {event.endTime} </p>
      <p>
        Categories:{" "}
        {categoryNames.length > 0
          ? categoryNames.join(", ")
          : "No categories available"}
      </p>
      <h3>
        Created by:{" "}
        <Link to={`user/${event.createdBy}`}>
          {users.find((user) => event.createdBy === user.id)?.name ||
            "User not found"}
        </Link>
      </h3>
      <Link to={`users/${event.userId}`}>
        {userImage ? (
          <img
            src={userImage}
            alt={user?.name}
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ccc",
              color: "#ffg",
              fontSize: "16px",
              borderradius: "50%",
            }}
          >
            No image available
          </div>
        )}
      </Link>
      <hr />
    </div>
  );
};
export default EventPage;
