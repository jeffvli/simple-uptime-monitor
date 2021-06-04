import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Container, Item, Button, Image, Icon } from "semantic-ui-react";

import AddMonitorModal from "./components/modals/AddMonitorModal";
import MonitorList from "./components/MonitorList";
import GlobalStats from "./components/GlobalStats";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div>
        <Navbar></Navbar>
        <Container className="main-content">
          <Card title="Overview">
            <GlobalStats />
          </Card>
          <Card title="Monitors">
            <MonitorList />
          </Card>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
