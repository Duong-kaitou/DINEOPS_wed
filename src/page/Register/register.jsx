import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import logo from "../../assets/logo.svg";

import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserCircle,
  Phone,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword_confirm, setShowPassword_confirm] = useState(false);

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    user_name: "",
    email: "",
    password: "",
    phone: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký:", formData);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center p-3 overflow-hidden position-relative">
      {/* Nền Blur trang trí (Tùy chọn) */}
      <div className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="position-absolute top-0 start-0 translate-middle w-50 h-50 bg-primary opacity-10 rounded-circle blur-5" style={{ filter: 'blur(100px)' }} />
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden position-relative">
              {/* Nút Quay lại */}
              <button
                onClick={() => navigate(-1)}
                className="btn position-absolute top-0 start-0 m-3 rounded-circle d-flex align-items-center justify-content-center text-muted border-0 shadow-none hover-orange"
                style={{ width: '40px', height: '40px' }}
              >
                <ArrowLeft size={20} />
              </button>

              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-block p-2 bg-white shadow-sm rounded-4 mb-3 border">
                    <img src={logo} alt="Logo" style={{ width: '48px', height: '48px' }} />
                  </div>
                  <h1 className="h4 fw-bold mb-1">Đăng Ký Tài Khoản</h1>
                  <p className="text-muted small">Bắt đầu quản lý nhà hàng chuyên nghiệp</p>
                </div>

                <Form onSubmit={handleSubmit} className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
                  {/* Họ và Tên */}
                  <Row className="g-3 mb-3">
                    <Col xs={6}>
                      <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Họ</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0 text-muted"><User size={16} /></InputGroup.Text>
                        <Form.Control
                          name="last_name"
                          placeholder="Nguyễn"
                          className="bg-light border-start-0 py-2"
                          onChange={handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                    <Col xs={6}>
                      <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Tên</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0 text-muted"><User size={16} /></InputGroup.Text>
                        <Form.Control
                          name="first_name"
                          placeholder="Văn A"
                          className="bg-light border-start-0 py-2"
                          onChange={handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* Tên đăng nhập */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Tên đăng nhập</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><UserCircle size={16} /></InputGroup.Text>
                      <Form.Control
                        name="user_name"
                        placeholder="nguyenvana"
                        className="bg-light border-start-0 py-2"
                        onChange={handleInputChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Mail size={16} /></InputGroup.Text>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        className="bg-light border-start-0 py-2"
                        onChange={handleInputChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Số điện thoại */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Số điện thoại</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Phone size={16} /></InputGroup.Text>
                      <Form.Control
                        name="phone"
                        type="tel"
                        placeholder="0123 456 789"
                        className="bg-light border-start-0 py-2"
                        onChange={handleInputChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Mật khẩu */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Lock size={16} /></InputGroup.Text>
                      <Form.Control
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-light border-start-0 border-end-0 py-2 shadow-none"
                        onChange={handleInputChange}
                        required
                      />
                      <InputGroup.Text 
                        className="bg-light border-start-0 text-muted cursor-pointer" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Xác nhận mật khẩu */}
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-uppercase text-muted ms-1">Xác nhận mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Lock size={16} /></InputGroup.Text>
                      <Form.Control
                        name="password_confirm"
                        type={showPassword_confirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-light border-start-0 border-end-0 py-2 shadow-none"
                        onChange={handleInputChange}
                        required
                      />
                      <InputGroup.Text 
                        className="bg-light border-start-0 text-muted cursor-pointer" 
                        onClick={() => setShowPassword_confirm(!showPassword_confirm)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword_confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Điều khoản */}
                  <Form.Check className="mb-4 small">
                    <Form.Check.Input 
                      id="agreeTerms" 
                      name="agreeTerms" 
                      required 
                      onChange={handleInputChange}
                    />
                    <Form.Check.Label htmlFor="agreeTerms" className="text-muted">
                      Tôi đồng ý với <span className="text-orange fw-bold">Điều khoản</span> và <span className="text-orange fw-bold">Bảo mật</span>.
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Nút đăng ký */}
                  <Button  
                    type="submit" 
                    className="w-100 py-3 rounded-4 fw-bold shadow border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#e65e19' }}
                  >
                    Đăng ký ngay <ArrowRight size={18} />
                  </Button>
                </Form>

                <div className="text-center mt-4 small">
                  <span className="text-muted">Bạn đã có tài khoản?</span>
                  <Link to="/login" className="text-orange fw-bold text-decoration-none ms-1">Đăng nhập</Link>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4 opacity-50">
              <p style={{ fontSize: '9px', letterSpacing: '0.2em' }}>RESTAURANT OS © 2026</p>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .text-orange { color: #e65e19 !important; }
        .hover-orange:hover { color: #e65e19 !important; background-color: rgba(230, 94, 25, 0.1); }
        .btn-primary:hover { background-color: #cc4d0f !important; }
        .form-control:focus { border-color: #e65e19; box-shadow: 0 0 0 0.25rem rgba(230, 94, 25, 0.25); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7d7d0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Register;