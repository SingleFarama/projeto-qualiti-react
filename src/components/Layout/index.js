import { Container } from "react-bootstrap";
import Topbar from "../Navbar";

const Layout = ({ children, routes }) => (
  <>
    <Topbar routes={routes} />
    <Container className="mt-3">{children}</Container>
    <Container className="mt-5"></Container>
  </>
);

export default Layout;
