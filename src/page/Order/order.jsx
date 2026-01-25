import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Nav,
  Navbar,
  InputGroup,
  Badge,
} from "react-bootstrap";
import logo from "../../assets/logo.svg";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Burger Bò Truffle",
    price: 18.0,
    desc: "Thịt bò Wagyu, sốt nấm truffle, phô mai Thụy Sĩ và hành tây caramel.",
    img: "https://th.bing.com/th/id/OIP.UUInOeMU6fmUFk0IijKnGQHaHa?w=184&h=184&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
  },
  {
    id: 2,
    name: "Salad ",
    price: 12.0,
    desc: "Rau xanh tổng hợp, cà chua bi, dưa chuột, củ cải đỏ và sốt balsamic.",
    img: "https://genuss-suche.de/wp-content/uploads/2026/01/Caesar-Salat.jpg",
  },
  {
    id: 3,
    name: "Cá Hồi Nướng",
    price: 24.0,
    desc: "Cá hồi Đại Tây Dương, rau củ theo mùa và sốt bơ chanh thảo mộc.",
    img: "https://th.bing.com/th/id/OIP.ZiJlPOVF-dSxxAtwCFkEvAHaEK?w=312&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
  },
  {
    id: 4,
    name: "Mỳ Ý Carbonara",
    price: 16.0,
    desc: "Mỳ Ý, má heo muối, lòng đỏ trứng, phô mai pecorino và tiêu đen.",
    img: "https://bloganchoi.com/wp-content/uploads/2021/10/cach-lam-mi-y-carbonara-2.jpg",
  },
  {
    id: 5,
    name: "Bít Tết Khoai Tây",
    price: 32.0,
    desc: "Thăn lưng bò 300g, khoai tây chiên thủ công và sốt rượu vang đỏ.",
    img: "https://th.bing.com/th/id/OIP.G4liadj0C14ArbpQmUxD1wHaE8?w=265&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
  },
  {
    id: 6,
    name: "Pizza Margherita",
    price: 15.0,
    desc: "Cà chua San Marzano, phô mai mozzarella tươi, húng tây và dầu oliu.",
    img: "https://tse1.mm.bing.net/th/id/OIP.67HufXX0DvcQawQzK7VxgQHaH4?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];

const OrderPage = () => {
  // Quản lý trạng thái đơn hàng hiện tại
  const [order, setOrder] = useState([
    {
      id: 1,
      name: "Burger Bò Truffle",
      price: 18.0,
      quantity: 1,
      note: "Không lấy hành tây, thêm sốt truffle",
    },
    { id: 3, name: "Cá Hồi Nướng", price: 24.0, quantity: 1, note: "" },
  ]);

  // Logic tính toán hóa đơn
  const subtotal = order.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;

  // Hàm thêm món mới vào đơn hàng
  const addToOrder = (item) => {
    const existingItem = order.find((o) => o.id === item.id);
    if (existingItem) {
      setOrder(
        order.map((o) =>
          o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
        )
      );
    } else {
      setOrder([...order, { ...item, quantity: 1, note: "" }]);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Thanh điều hướng / Header */}
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

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Danh sách Thực đơn */}
        <main className="flex-grow-1 overflow-auto p-4">
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
            {[
              "Tất cả",
              "Khai vị",
              "Món chính",
              "Burgers",
              "Đồ uống",
              "Tráng miệng",
            ].map((cat, idx) => (
              <Button
                key={cat}
                variant={idx === 0 ? "success" : "white"}
                className={`text-nowrap border shadow-sm px-4 ${
                  idx !== 0 && "bg-white"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <Row className="g-4">
            {MENU_ITEMS.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={2}>
                <Card className="h-100 border-0 shadow-sm hover-border-success transition card-hover">
                  <Card.Img
                    variant="top"
                    src={item.img}
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title
                        className="fw-bold mb-0 text-dark"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {item.name}
                      </Card.Title>
                      <span className="text-success fw-bold">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <Card.Text className="text-muted small flex-grow-1">
                      {item.desc}
                    </Card.Text>
                    <Button
                      variant="outline-success"
                      className="w-100 fw-bold mt-3 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => addToOrder(item)}
                    >
                      <span className="material-symbols-outlined fs-5">
                        add_circle
                      </span>{" "}
                      Thêm vào đơn
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </main>

        {/* Tóm tắt đơn hàng */}
        <aside
          className="bg-white border-start d-none d-xl-flex flex-column shadow-lg"
          style={{ width: "400px" }}
        >
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
            <h5 className="fw-bold mb-0">Chi tiết đơn hàng</h5>
            <Badge
              bg="success-subtle"
              className="text-success rounded-pill px-3 py-2"
            >
              Bàn số 12
            </Badge>
          </div>

          <div className="flex-grow-1 overflow-auto p-3">
            {order.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <span className="material-symbols-outlined fs-1 d-block mb-2">
                  shopping_basket
                </span>
                Chưa có món nào được chọn
              </div>
            ) : (
              order.map((item) => (
                <Card
                  key={item.id}
                  className="bg-light border-0 mb-3 p-3 shadow-xs"
                >
                  <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="success" className="p-1 px-2">
                        {item.quantity}
                      </Badge>
                      <span className="fw-bold text-dark">{item.name}</span>
                    </div>
                    <span className="fw-semibold text-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-white border-end-0">
                      <span className="material-symbols-outlined fs-5 text-muted">
                        edit_note
                      </span>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Ghi chú thêm cho bếp..."
                      className="border-start-0 ps-0 bg-white"
                      defaultValue={item.note}
                    />
                  </InputGroup>
                </Card>
              ))
            )}
          </div>

          {/* Tổng kết và Thanh toán */}
          <div className="p-4 border-top bg-light mt-auto">
            <div className="d-flex justify-content-between text-muted mb-1">
              <span>Tạm tính</span>
              <span className="fw-bold text-dark">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-3">
              <span>Thuế (8%)</span>
              <span className="fw-bold text-dark">${tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
              <h4 className="fw-bold mb-0 text-dark">Tổng tiền</h4>
              <h4 className="text-success fw-bold mb-0">
                ${(subtotal + tax).toFixed(2)}
              </h4>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="outline-success"
                size="lg"
                className="fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
              >
                <span className="material-symbols-outlined">send</span> Gửi đơn
                xuống bếp
              </Button>
              <Button
                variant="success"
                size="lg"
                className="fw-bold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 rounded-3"
              >
                <span className="material-symbols-outlined">payments</span>{" "}
                Thanh toán ngay
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Hiệu ứng CSS bổ sung */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        
        .material-symbols-outlined { 
          font-variation-settings: 'FILL' 0, 'wght' 400; 
          vertical-align: middle;
        }

        .card-hover:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          border: 1px solid #198754 !important;
          transition: all 0.3s ease;
        }

        .transition { transition: all 0.2s ease-in-out; }

        /* Tối ưu thanh cuộn */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default OrderPage;
