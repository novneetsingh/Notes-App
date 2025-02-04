import React, { useEffect, useState } from "react";
import NotesCard from "./NotesCard";
import axios from "axios";

const Favourites = ({ isUpdated, setIsUpdated, filteredNotes }) => {
  const [notes, setNotes] = useState([]);

  // fetch all favourite notes of user
  useEffect(() => {
    const fetchFavouriteNotes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notes/favourite-notes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setNotes(response.data.notes);
        setIsUpdated(false);
      } catch (error) {
        console.error("Error fetching favourite notes:", error);
      }
    };

    fetchFavouriteNotes();
  }, [isUpdated]);

  const notesToRender = filteredNotes !== null ? filteredNotes : notes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {notesToRender.map((note, index) => (
        <NotesCard key={index} note={note} setIsUpdated={setIsUpdated} />
      ))}
    </div>
  );
};

export default Favourites;
