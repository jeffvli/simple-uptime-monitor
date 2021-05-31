import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import moment from "moment";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState();

  setInterval(() => {
    setCurrentTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, 1000);

  return <footer className="center-align">{currentTime}</footer>;
};

export default Footer;
