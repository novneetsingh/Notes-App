import React from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useVoiceRecorder } from "../hooks/voiceRecorder";

const VoiceNote = ({ setIsUpdated }) => {
  const { register, handleSubmit, reset } = useForm();
  const {
    isRecording,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording,
    getTranscribedText,
  } = useVoiceRecorder();

  const onSubmit = async (data) => {
    if (!data.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!audioBlob) {
      toast.error("Please record some audio first");
      return;
    }

    try {
      toast.loading("Creating note...");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("transcribedText", getTranscribedText());

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/notes/create-notes`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();
      toast.success("Note created successfully!");
      reset();
      setAudioBlob(null);
      setIsUpdated(true);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  return (
    <div className=" w-3/4 mx-auto p-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3"
      >
        <input
          type="text"
          {...register("title")}
          placeholder="Note title..."
          className="flex-1 px-4 py-2 text-gray-700  focus:outline-none "
        />

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-full transition-all duration-200 ${
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isRecording ? "Stop recording" : "Start recording"}
        </button>

        <button
          type="submit"
          disabled={!audioBlob}
          className={`p-2 rounded-full transition-colors ${
            audioBlob
              ? "text-purple-500 hover:bg-purple-50"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default VoiceNote;
