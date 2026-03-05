export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "long",      
    day: "2-digit",     
    year: "numeric",   
    hour: "2-digit",   
    minute: "2-digit",  
    hour12: true,      
  }).replace(",", "   "); // extra spacing
};

export const subjects = [
  { label: "English", value: "ENGLISH" },
  { label: "Mathematics", value: "MATHEMATICS" },
  { label: "Science", value: "SCIENCE" },
  { label: "History", value: "HISTORY" },
  { label: "Geography", value: "GEOGRAPHY" },
  { label: "Computer Science", value: "COMPUTER_SCIENCE" },
  { label: "Business Economics", value: "BUSINESS_ECONOMICS" },
  { label: "Languages", value: "LANGUAGES" },
  { label: "Other", value: "OTHER" },
];

export const difficulties = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
  { label: "Mix", value: "MIX" },
];