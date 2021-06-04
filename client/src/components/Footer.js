import { useState } from "react";
import { Icon } from "semantic-ui-react";
import moment from "moment";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState();

  setInterval(() => {
    setCurrentTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }, 1000);

  return (
    <footer className="right-align">
      <a
        rel="noopener noreferrer"
        href={process.env.REACT_APP_GITHUB_URL}
        target="_blank"
      >
        <Icon name="github" size="large" link />
      </a>
    </footer>
  );
};

export default Footer;
