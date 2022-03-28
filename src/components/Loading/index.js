import { Spinner } from "react-bootstrap";

const Loading = () => (
  <div className="d-flex justify-content-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Carregando...</span>
    </Spinner>
  </div>
);

export default Loading;
