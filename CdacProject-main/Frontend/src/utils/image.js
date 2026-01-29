export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  return imagePath;
};
