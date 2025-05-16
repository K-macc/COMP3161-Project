import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import { FaUserCircle, FaIdBadge, FaUserShield } from "react-icons/fa";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  localStorage.setItem('role',payload.role);
  localStorage.setItem('ID',payload.id);


  return (
    <Container className="mt-5">
      <h2 className="mb-4">Welcome to Your Dashboard!</h2>

      {payload ? (
        <Card className="p-4 shadow-sm">
          <Row>
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <FaUserCircle size={80} className="text-primary" />
            </Col>

            <Col md={10}>
              <h4>
                Hello, <strong>{payload.name || "User"} <span className="wave">👋</span></strong>
              </h4>
              <p className="mb-2">
                <FaIdBadge className="me-2" />
                <strong>ID:</strong> {payload.id}
              </p>
              <p>
                <FaUserShield className="me-2" />
                <strong>Role:</strong>{" "}
                <Badge bg="success" className="text-uppercase">
                  {payload.role}
                </Badge>
              </p>
            </Col>
          </Row>

          <hr />

          <h5 className="mt-4">General Information</h5>
          <ul>
            <li>This is your main dashboard page.</li>
            <li>Your role determines what actions you can take.</li>
            <li>Use the navbar to navigate to different sections.</li>
          </ul>
        </Card>
      ) : (
        <Card className="p-4 text-center shadow-sm">
          <p className="text-muted">No user logged in.</p>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
