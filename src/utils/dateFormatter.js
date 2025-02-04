export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  // Format time in 24-hour format
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${formattedDate}, ${hours}:${minutes}`;
};
