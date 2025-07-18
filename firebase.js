// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8Mx4NAN_8SfJHkbNNhl2fdek1TZR3ryQ",
  authDomain: "class-10-website.firebaseapp.com",
  projectId: "class-10-website",
  storageBucket: "class-10-website.firebasestorage.app",
  messagingSenderId: "743842091983",
  appId: "1:743842091983:web:1ebd6e56af260ebf6df8ba",
  measurementId: "G-7C9TPM3RM8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Roll numbers to store in Firestore
const rollNumbers = [
  96, 111, 112, 117, 143, 144, 163, 166, 174, 182, 189, 237, 239, 249, 259, 266,
  279, 282, 301, 304, 320, 324, 336, 339, 346, 256, 179, 192, 193, 243, 263,
  265, 274, 273, 276, 281, 283, 284, 300, 306, 308, 319, 327, 328, 334, 342,
];

// Store roll numbers in Firestore as document IDs
const usersRef = collection(db, "users");
rollNumbers.forEach((rollNumber) => {
  // Using setDoc with the roll number as the document ID
  setDoc(doc(usersRef, rollNumber.toString()), {
    rollNumber: rollNumber,
    role: "student", // Default role; adjust as needed
  })
    .then(() => {
      console.log("Roll number " + rollNumber + " added successfully.");
    })
    .catch((error) => {
      console.error("Error adding roll number: " + error);
    });
});

// Function to sign in with email and roll number
export const loginWithEmailAndRoll = async (email, rollNumber) => {
  try {
    // Sign in with email (assuming users' password is known)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      "your_password" // Use actual password for email
    );
    const user = userCredential.user;

    // Check if roll number exists in Firestore
    const q = query(usersRef, where("rollNumber", "==", parseInt(rollNumber)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Invalid Roll Number");
    } else {
      console.log("Login Successful with valid roll number");
      return user; // Return the user if login is successful
    }
  } catch (error) {
    console.error("Login failed: ", error.message);
    throw error;
  }
};
