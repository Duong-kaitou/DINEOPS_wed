import React, { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import logo from '../../assets/logo.svg';
import { setAuthTokens, setUserInfo } from '../../utils/localStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const loginUrl = `${baseUrl.replace(/\/$/, '')}/api/v1/users/login/`;

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setErrorMessage('');
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.username.trim() || !formData.password) {
        setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập');
        return;
      }

      setIsSubmitting(true);
      setErrorMessage('');

      const payload = {
        identifier: formData.username.trim(),
        password: formData.password,
      };

      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.status) {
          const message = result?.msg || result?.detail || 'Đăng nhập thất bại';
          throw new Error(message);
        }

        const accessToken = result?.data?.access_token;
        const refreshToken = result?.data?.refresh_token;

        if (!accessToken || !refreshToken) {
          throw new Error('Không nhận được token từ server');
        }

        setAuthTokens({ accessToken, refreshToken });
        setUserInfo(result?.data?.user || null);
        navigate('/dashboard');
      } catch (error) {
        setErrorMessage(error.message || 'Có lỗi xảy ra khi đăng nhập');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, loginUrl, navigate]
  );

  return (
    // Sử dụng vh-100 để chiếm toàn màn hình, bg-light thay cho màu nền xám nhạt
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light transition-all p-3">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-4 p-md-5">

                {/* Header - Logo & Title */}
                <div className="text-center mb-4">
                  <div className="d-inline-block p-2 bg-white shadow-sm rounded-3 mb-3">
                    <img
                      src={logo}
                      alt="DineOps Logo"
                      style={{ width: '64px', height: '64px' }}
                    />
                  </div>
                  <h2 className="fw-bold h3 mb-1">Chào mừng trở lại</h2>
                  <p className="text-muted small">Đăng nhập hệ quản lý</p>
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="small fw-semibold ms-1">Tên đăng nhập / Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="user@restaurant.com"
                      className="py-2 px-3 rounded-3"
                      style={{ height: '50px' }}
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                      disabled={isSubmitting}
                    />
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="small fw-semibold ms-1">Mật khẩu</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        className="py-2 px-3 border-end-0 rounded-start-3"
                        style={{ height: '50px' }}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                      />
                      {/* Nút ẩn/hiện mật khẩu sử dụng InputGroup của Bootstrap */}
                      <InputGroup.Text
                        className="bg-white border-start-0 rounded-end-3 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Links: Register & Forgot Password */}
                  <div className="d-flex justify-content-between mb-4 px-1">
                    <Link to="/register" className="small fw-bold text-decoration-none text-orange">
                      Đăng ký tài khoản
                    </Link>
                    <Link to="/forgot-password" className="small fw-bold text-decoration-none text-orange">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {errorMessage ? (
                    <div className="text-danger small mb-3 px-1">{errorMessage}</div>
                  ) : null}

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 py-2 fw-bold rounded-3 shadow-sm border-0"
                    style={{ backgroundColor: '#e65e19', height: '50px' }}
                  >
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </Form>

                {/* Footer */}
                <div className="mt-5 text-center">
                  <hr className="text-muted opacity-25" />
                  <p className="small text-muted mb-1">
                    Cần hỗ trợ?{' '}
                    <Link to="/contact" className="fw-bold text-decoration-none text-orange">
                      Liên hệ Admin
                    </Link>
                  </p>
                  <p className="text-muted" style={{ fontSize: '10px' }}>Restaurant OS v2.4.0</p>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Inline CSS để xử lý màu cam thương hiệu của bạn */}
      <style>{`
        .text-orange { color: #e65e19 !important; }
        .text-orange:hover { text-decoration: underline !important; }
        .btn-primary:hover { background-color: #d45214 !important; }
      `}</style>
    </div>
  );
};

export default LoginPage;