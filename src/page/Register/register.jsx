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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    user_name: "",
    email: "",
    password: "",
    password_confirm: "",
    phone_number: "",
    agreeTerms: false,
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const registerUrl = `${baseUrl.replace(/\/$/, "")}/api/v1/users/register/`;

  const validateField = (name, value, data) => {
    switch (name) {
      case "last_name":
      case "first_name":
        if (!value.trim()) return "Trường này là bắt buộc";
        if (value.trim().length < 2) return "Phải có ít nhất 2 ký tự";
        return "";
      case "user_name":
        if (!value.trim()) return "Tên đăng nhập là bắt buộc";
        if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
          return "4-20 ký tự, chỉ gồm chữ, số hoặc dấu _";
        }
        return "";
      case "email":
        if (!value.trim()) return "Email là bắt buộc";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Email không hợp lệ";
        return "";
      case "phone_number":
        if (!value.trim()) return "Số điện thoại là bắt buộc";
        if (!/^\+?[0-9]{9,15}$/.test(value)) {
          return "Số điện thoại không hợp lệ (9-15 số, có thể bắt đầu bằng +)";
        }
        return "";
      case "password":
        if (!value) return "Mật khẩu là bắt buộc";
        if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        return "";
      case "password_confirm":
        if (!value) return "Vui lòng nhập lại mật khẩu";
        if (value !== data.password) return "Mật khẩu nhập lại không khớp";
        return "";
      case "agreeTerms":
        if (!value) return "Bạn cần đồng ý điều khoản";
        return "";
      default:
        return "";
    }
  };

  const validateForm = (data) => {
    const fields = [
      "last_name",
      "first_name",
      "user_name",
      "email",
      "phone_number",
      "password",
      "password_confirm",
      "agreeTerms",
    ];

    const nextErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, data[field], data);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: nextValue,
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, nextValue, nextData),
        ...(name === "password"
          ? {
            password_confirm: validateField(
              "password_confirm",
              nextData.password_confirm,
              nextData
            ),
          }
          : {}),
      }));

      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setIsSubmitting(true);

    const payload = {
      email: formData.email,
      user_name: formData.user_name,
      phone_number: formData.phone_number,
      password: formData.password,
      password_confirm: formData.password_confirm,
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.detail || "Đăng ký thất bại";
        throw new Error(errorMessage);
      }

      alert("Đăng ký thành công");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsSubmitting(false);
    }
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

                <Form noValidate onSubmit={handleSubmit} className="custom-scrollbar" style={{ maxHeight: '60vh', paddingRight: '5px' }}>
                  <Row className="g-3 mb-3">
                    <Col xs={6}>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0 text-muted"><User size={16} /></InputGroup.Text>
                        <Form.Control
                          name="last_name"
                          placeholder="Họ"
                          className="bg-light border-start-0 py-2"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.last_name}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={6}>
                      <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0 text-muted"><User size={16} /></InputGroup.Text>
                        <Form.Control
                          name="first_name"
                          placeholder="Tên"
                          className="bg-light border-start-0 py-2"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.first_name}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  {/* Tên đăng nhập */}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><UserCircle size={16} /></InputGroup.Text>
                      <Form.Control
                        name="user_name"
                        placeholder="Tên đăng nhập"
                        className="bg-light border-start-0 py-2"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.user_name}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.user_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Mail size={16} /></InputGroup.Text>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="bg-light border-start-0 py-2"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Số điện thoại */}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Phone size={16} /></InputGroup.Text>
                      <Form.Control
                        name="phone_number"
                        type="tel"
                        placeholder="Số điện thoại"
                        className="bg-light border-start-0 py-2"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone_number}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.phone_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Mật khẩu */}
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Lock size={16} /></InputGroup.Text>
                      <Form.Control
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="bg-light border-start-0 border-end-0 py-2 shadow-none"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                      />
                      <InputGroup.Text
                        className="bg-light border-start-0 text-muted cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Xác nhận mật khẩu */}
                  <Form.Group className="mb-4">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0 text-muted"><Lock size={16} /></InputGroup.Text>
                      <Form.Control
                        name="password_confirm"
                        type={showPassword_confirm ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        className="bg-light border-start-0 border-end-0 py-2 shadow-none"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password_confirm}
                      />
                      <InputGroup.Text
                        className="bg-light border-start-0 text-muted cursor-pointer"
                        onClick={() => setShowPassword_confirm(!showPassword_confirm)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword_confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.password_confirm}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Điều khoản */}
                  <Form.Check className="mb-4 small">
                    <Form.Check.Input
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      isInvalid={!!errors.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <Form.Check.Label htmlFor="agreeTerms" className="text-muted">
                      Tôi đồng ý với <span className="text-orange fw-bold">Điều khoản</span> và <span className="text-orange fw-bold">Bảo mật</span>.
                    </Form.Check.Label>
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.agreeTerms}
                    </Form.Control.Feedback>
                  </Form.Check>

                  {/* Nút đăng ký */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 py-3 rounded-4 fw-bold shadow border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#e65e19' }}
                  >
                    {isSubmitting ? "Đang đăng ký..." : "Đăng ký ngay"} <ArrowRight size={18} />
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