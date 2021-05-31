export const calculateDateDifference = (date) => {
  const currentDate = new Date().getTime();
  const lastDate = new Date(date).getTime();
  const dateDifference = Math.abs(currentDate - lastDate);

  const seconds = dateDifference / 1000;

  const time = {
    seconds: seconds,
    minutes: seconds / 60,
    hours: seconds / 3600,
    days: seconds / 86400,
  };

  return time;
};
