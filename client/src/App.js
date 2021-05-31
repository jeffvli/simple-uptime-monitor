import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import MonitorList from "./components/MonitorList";
import React from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Footer from "./components/Footer";
import { Container, Item, Button } from "semantic-ui-react";

import AddMonitorModal from "./components/AddMonitorModal";

function App() {
  return (
    <Router>
      <div>
        <Navbar></Navbar>
        <Container className="main-content">
          <Card
            title="Monitors"
            subtitle=""
            footer={<AddMonitorModal />}
            alignFooter="right-align"
          >
            <MonitorList />
          </Card>
        </Container>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
