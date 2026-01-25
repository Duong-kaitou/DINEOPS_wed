import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Container, Navbar, Button } from 'react-bootstrap';
import logo from '../../assets/logo.svg';

const Header = () => {
  return (
    // fixed-top là class của Bootstrap để ghim header lên trên cùng
    <Navbar
        bg="white"
        expand="lg"
        className="border-bottom px-4 sticky-top shadow-sm"
      >
        <Navbar.Brand
          href="#"
          className="d-flex align-items-center fw-bold text-success"
        >
          <img
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt=""
          />
          DineOps
        </Navbar.Brand>

        <Form
          className="d-none d-md-flex ms-4 flex-grow-1"
          style={{ maxWidth: "350px" }}
        >
          <InputGroup size="sm">
            <InputGroup.Text className="bg-light border-end-0">
              <span className="material-symbols-outlined fs-6 text-success">
                search
              </span>
            </InputGroup.Text>
            <Form.Control
              className="bg-light border-start-0"
              placeholder="Tìm kiếm món ăn, đồ uống..."
            />
          </InputGroup>
        </Form>

        <Nav className="ms-auto d-none d-md-flex align-items-center gap-3 font-weight-bold">
          <Nav.Link
            href="#"
            className="text-success border-bottom border-success border-2"
          >
            Đặt món
          </Nav.Link>
          <Nav.Link href="#" className="text-dark">
            Sơ đồ bàn
          </Nav.Link>
          <div className="vr mx-2"></div>
          <Button variant="link" className="text-dark position-relative p-1">
            <span className="material-symbols-outlined">notifications</span>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </Button>
        </Nav>
      </Navbar>
  );
};

export default Header;