import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { ArrowLeft, Mail, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Yêu cầu khôi phục cho:', email);
  };

  return (
    // bg-light cung cấp nền xám nhạt tương đương #f8f6f6
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              
              {/* Header của Card */}
              <div className="d-flex align-items-center p-3 border-bottom bg-white">
                <Button 
                  variant="link" 
                  onClick={() => navigate(-1)}
                  className="text-muted p-2 rounded-circle hover-bg-light"
                >
                  <ArrowLeft size={20} />
                </Button>
                <Card.Title className="flex-grow-1 text-center mb-0 fw-bold h6 pe-5">
                  Khôi phục mật khẩu
                </Card.Title>
              </div>

              <Card.Body className="px-4 py-5">
                {/* Icon minh họa */}
                <div className="d-flex justify-content-center mb-4">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-4 shadow-sm border"
                    style={{ width: '80px', height: '80px', backgroundColor: '#fcf9f8' }}
                  >
                    <Mail size={32} style={{ color: '#e65e19' }} />
                  </div>
                </div>

                {/* Tiêu đề nội dung */}
                <div className="text-center mb-4">
                  <h1 className="h4 fw-bold mb-2">Quên mật khẩu?</h1>
                  <p className="text-muted small px-2">
                    Vui lòng nhập email liên kết với tài khoản. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu cho bạn.
                  </p>
                </div>

                {/* Form khôi phục */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label className="small fw-bold ms-1">Địa chỉ Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0 text-muted">
                        <Mail size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        required
                        placeholder="example@restaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-start-0 py-2 shadow-none"
                        style={{ height: '50px' }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-bold border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#e65e19', height: '50px' }}
                  >
                    Gửi yêu cầu <Send size={18} />
                  </Button>
                </Form>

                {/* Footer chuyển hướng */}
                <div className="mt-5 pt-4 border-top text-center">
                  <Link
                    to="/login"
                    className="text-decoration-none fw-bold small d-inline-flex align-items-center gap-2"
                    style={{ color: '#e65e19' }}
                  >
                    <ArrowLeft size={16} />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Style tùy chỉnh cho các trạng thái Hover */}
      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .form-control:focus { border-color: #e65e19; }
        .btn:active { transform: scale(0.98); transition: 0.1s; }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;