import { Menu, Container, Image, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Menu fixed="top">
      <Container>
        <Link to="/">
          <Menu.Item header>Simple Uptime Monitor</Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
};

export default Navbar;
