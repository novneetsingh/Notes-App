import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { debounce } from "lodash";

const Searchbar = ({ setFilteredNotes }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = debounce(async (term) => {
    if (term.trim() === "") {
      setFilteredNotes(null);
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/notes/search-notes/?search=${term}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setFilteredNotes(response.data.notes);
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="flex items-center justify-between w-full px-4 py-4 border-b">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-md focus:outline-none focus:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default Searchbar;
