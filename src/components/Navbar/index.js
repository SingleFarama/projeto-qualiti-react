import { Navbar, Container, Nav } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const Topbar = ({ location, routes = [] }) => {
  return (
    <Navbar bg="success" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand href="/home">Professsor Allocation</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" Collapse="true">
            {routes
              .filter((route) => route.visible ?? true)
              .map((route, index) => (
                <Link
                  className={`nav-link ${
                    location.pathname === route.path ? "active" : ""
                  }`}
                  to={route.path}
                  key={`-SU${index}`}
                >
                  {route.name}
                </Link>
              ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default withRouter(Topbar);
