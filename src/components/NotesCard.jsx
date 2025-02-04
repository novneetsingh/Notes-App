import { useState } from "react";
import { Copy, Pencil, Trash, Star } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { formatDateTime } from "../utils/dateFormatter";
import EditNoteModal from "../modals/editNoteModal";
import { copyToClipboard } from "../utils/copyToClipboard";

const NotesCard = ({ note, setIsUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/notes/delete/${note._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setIsUpdated(true);
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleFavourite = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/mark-favourite/${note._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setIsUpdated(true);
      toast.success(
        note.isFavourite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-[200px] w-[250px]">
      {/* Header with Date and Star */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">
          {formatDateTime(note.createdAt)}
        </span>
        <button
          onClick={handleFavourite}
          className={`p-1 rounded-full transition-all hover:bg-gray-200 ${
            note.isFavourite
              ? "text-yellow-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Star
            className="w-4 h-4"
            fill={note.isFavourite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Note Content */}
      <div className="flex-1 overflow-hidden">
        <h3 className="font-semibold text-base text-gray-900 truncate">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed overflow-hidden">
          {note.content}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-2 justify-end">
        <button
          onClick={() => copyToClipboard(note.content)}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          title="Edit note"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-all"
          title="Delete note"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        note={note}
        setIsUpdated={setIsUpdated}
      />
    </div>
  );
};

export default NotesCard;
