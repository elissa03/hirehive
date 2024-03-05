import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import fb_config from "../database/firebase.config.js";

// initialize a firebase application
initializeApp(fb_config.firebaseConfig);

// initialize cloud storage and get a reference to the service
const storage = getStorage();

const uploadFileToStorage = async (file) => {
  try {
    // create a reference for the file in the cloud storage bucket
    const storageRef = ref(storage, `images/${file.originalname}`);

    // create file metadata including the content type
    const metadata = {
      contentType: file.mimetype,
    };

    // upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    // grab the public URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");
    return {
      message: "File uploaded to Firebase Storage",
      name: file.originalname,
      type: file.mimetype,
      downloadURL: downloadURL,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFileDownloadURL = async (filename) => {
  try {
    // reference the file in the storage by its name
    const storageRef = ref(storage, filename);
    // get the file's download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { uploadFileToStorage, getFileDownloadURL };
