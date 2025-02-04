import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Copy } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import TextArea from "../components/TextArea";
import { formatDateTime } from "../utils/dateFormatter";
import { copyToClipboard } from "../utils/copyToClipboard";

const EditNoteModal = ({ isOpen, onClose, note, setIsUpdated }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      content: "",
      transcribedText: "",
    },
  });
  const [activeTab, setActiveTab] = useState("notes");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Clear selected images when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setSelectedImages([]);
    }
  }, [isOpen]);

  // Set form values from note when modal opens
  useEffect(() => {
    if (isOpen && note) {
      setValue("title", note.title || "");
      setValue("content", note.content || "");
      setValue("transcribedText", note.transcribedText || "");
    }
  }, [isOpen, note, setValue]);

  // Handle file selection for images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  // Submit the form to update note
  const onSubmit = async (data) => {
    setIsLoading(true);
    toast.loading("Updating note...");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("transcribedText", data.transcribedText);

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/notes/update/${note._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();

      toast.success("Note updated successfully!");
      setIsUpdated(true);
      setSelectedImages([]);
      onClose();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render the modal if it's not open
  if (!isOpen) return null;

  // Determine which content to display and copy based on active tab
  const currentText =
    activeTab === "notes" ? watch("content") : watch("transcribedText");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <input
                {...register("title")}
                className="text-xl font-semibold w-full px-2 py-1 border border-transparent focus:border-gray-300 rounded outline-none"
                placeholder="Note title"
              />
              {note?.createdAt && (
                <div className="text-sm text-gray-500 mt-1">
                  {formatDateTime(note.createdAt)}
                </div>
              )}
            </div>
          </div>

          {/* Audio Player */}
          {note?.audio && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <audio controls className="w-full">
                <source src={note.audio} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 ${
                  activeTab === "notes"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500"
                }`}
              >
                Notes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transcript")}
                className={`px-4 py-2 ${
                  activeTab === "transcript"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-500"
                }`}
              >
                Transcript
              </button>
            </div>

            <div className="mt-4 relative">
              <TextArea
                value={currentText}
                onChange={(e) =>
                  setValue(
                    activeTab === "notes" ? "content" : "transcribedText",
                    e.target.value
                  )
                }
                placeholder={
                  activeTab === "notes"
                    ? "Add your notes here..."
                    : "Transcribed text appears here..."
                }
              />
              <button
                type="button"
                onClick={() => copyToClipboard(currentText)}
                title="Copy content"
                className="absolute right-2 top-2 p-1 text-gray-600 hover:text-gray-900"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Image className="h-5 w-5" />
                <span>Add Images</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
              </label>
              {selectedImages.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedImages.length} image(s) selected
                </span>
              )}
            </div>

            {(note?.images?.length > 0 || selectedImages.length > 0) && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {note?.images?.map((image, index) => (
                  <a
                    key={`existing-${index}`}
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Note image ${index + 1}`}
                      className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    />
                  </a>
                ))}
                {selectedImages.map((image, index) => (
                  <a
                    key={`new-${index}`}
                    href={URL.createObjectURL(image)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt={`New image ${index + 1}`}
                      className="rounded-lg w-full h-24 object-cover cursor-pointer"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
