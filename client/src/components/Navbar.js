import { useState, useEffect } from "react";
import { Menu, Container, Image, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import AddMonitorModal from "./modals/AddMonitorModal";

const Navbar = () => {
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      setCounter(60);
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Link to="/">
          <Menu.Item header>Simple Uptime Monitor</Menu.Item>
        </Link>
        <AddMonitorModal />
        <Menu.Menu position="right">
          <div className="countdown">
            <b>{`Next Update: 00:${String(counter).padStart(2, "0")}`}</b>
          </div>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default Navbar;
