import { formatDistanceToNow, parseISO } from 'date-fns';

const formatUpdatedAt = (updatedAt) => { 
    const date = parseISO(updatedAt);
    return `Edited ${formatDistanceToNow(date)} ago`;
  };

export default { 
    formatUpdatedAt
}