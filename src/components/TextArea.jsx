import React from "react";

const TextArea = ({ value, onChange, placeholder, readOnly }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full min-h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
    />
  );
};

export default TextArea;
