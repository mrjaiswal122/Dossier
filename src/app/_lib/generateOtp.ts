import crypto from "crypto"


export default function generateSecureNumericPassword() {
  // Generate a secure random integer between 0 and 999999
  const buffer = crypto.randomBytes(4); // Generate 4 random bytes
  const secureNumber = buffer.readUInt32BE() % 1000000; // Restrict to 6 digits

  // Ensure the number is always 6 digits by checking the range
  return secureNumber < 100000 ? secureNumber + 100000 : secureNumber;
}