   export default function formatHeading(data:string) {
  return data
    .trim()
    .split(' ')
    .filter(s => s.length > 0) // Filters out empty strings to handle multiple spaces.
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) // Capitalizes the first letter and converts the rest to lowercase.
    .join(' ');
};