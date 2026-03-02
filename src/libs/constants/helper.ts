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
