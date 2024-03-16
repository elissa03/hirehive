const getLocalStorageUser = () => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  return null;
};

const setLocalStorageUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const getToken = () => {
  const parsedUser = getLocalStorageUser();
  return parsedUser.token;
};

const isUserLoggedIn = () => {
  const user = getLocalStorageUser();
  if (!user || !user.token) 
    return false;

  return true;
};


export default {
  getLocalStorageUser,
  setLocalStorageUser,
  getToken,
  isUserLoggedIn
};
