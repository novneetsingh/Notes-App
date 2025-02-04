import { useState, useEffect } from "react";
import NotesCard from "./NotesCard";
import axios from "axios";
import toast from "react-hot-toast";

const AllNotes = ({ isUpdated, setIsUpdated, filteredNotes }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notes/all-notes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setNotes(response.data.notes);
        setIsUpdated(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to fetch notes");
      }
    };

    fetchNotes();
  }, [isUpdated]);

  const notesToRender = filteredNotes !== null ? filteredNotes : notes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {notesToRender.map((note) => (
        <NotesCard key={note._id} note={note} setIsUpdated={setIsUpdated} />
      ))}
    </div>
  );
};

export default AllNotes;
