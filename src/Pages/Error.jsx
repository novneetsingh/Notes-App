import React from "react";
// Error component to display a 404 Not Found message
const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      {/* Error message displayed with responsive text sizing */}
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Error - 404 Page Not Found
      </p>
      {/* Subtext to offer a clearer explanation or additional info */}
      <p className="text-md sm:text-lg md:text-xl my-4">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default Error;
