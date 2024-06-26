import bcrypt from "bcrypt";


// Function to encrypt a password
const encryptPassword = async (password: string) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    throw error;
  }
};

// Function to compare a password with its hash
// password will be coming in request and hashedPassword is the one which is saved
const comparePasswords = async (password: string, hashedPassword: string) => {
  try {
    // Compare the password with its hash
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

export { encryptPassword, comparePasswords };
