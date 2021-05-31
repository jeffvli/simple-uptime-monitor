export const formatDateDifference = (date) => {
  if (date.days > 1) {
    return `${Math.round(date.days)} days ago`;
  } else if (date.hours > 1) {
    if (date.hours < 2) {
      return `${Math.round(date.hours)} hour ago`;
    }
    return `${Math.round(date.hours)} hours ago`;
  } else if (date.minutes > 1) {
    if (date.minutes < 2) {
      return `${Math.round(date.minutes)} minute ago`;
    }
    return `${Math.round(date.minutes)} minutes ago`;
  } else {
    if (date.seconds < 2) {
      return `${Math.round(date.seconds)} second ago`;
    }
    return `${Math.round(date.seconds)} seconds ago`;
  }
};
