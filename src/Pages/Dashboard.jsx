import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import VoiceNote from "../components/VoiceNote";
import AllNotes from "../components/AllNotes";
import Favourites from "../components/Favourites";
import { useState } from "react";
import Searchbar from "../components/Searchbar";

const Dashboard = () => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Searchbar setFilteredNotes={setFilteredNotes} />
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <AllNotes
                  isUpdated={isUpdated}
                  setIsUpdated={setIsUpdated}
                  filteredNotes={filteredNotes}
                />
              }
            />
            <Route
              path="favourites"
              element={
                <Favourites
                  isUpdated={isUpdated}
                  setIsUpdated={setIsUpdated}
                  filteredNotes={filteredNotes}
                />
              }
            />
          </Routes>
        </div>
        <VoiceNote setIsUpdated={setIsUpdated} />
      </div>
    </div>
  );
};

export default Dashboard;
