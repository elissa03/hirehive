import localStorageUtils from "../../utils/localStorageUtils";
import { formatDistanceToNow, parseISO } from 'date-fns';

const getLocalUserId = () => {
    const user = localStorageUtils.getLocalStorageUser();
    const userId = user._id;
    if (!userId) {
        console.log("User ID is not available.");
        return null;
    }

    return userId;
}

const formatUpdatedAt = (updatedAt) => { 
    const date = parseISO(updatedAt);
    return `Edited ${formatDistanceToNow(date)} ago`;
  };

export default {
    getLocalUserId, 
    formatUpdatedAt
}