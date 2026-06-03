import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './Auth.scss';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            // Auto login could go here, for now just redirect
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email might be in use.');
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center vh-100">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} className="auth-card shadow-sm p-4 rounded bg-white">
                    <h2 className="text-center mb-4">Fundoo Notes</h2>
                    <h4 className="text-center mb-4">Create your Account</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="firstName" placeholder="First name" onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="lastName" placeholder="Last name" onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Control type="email" name="email" placeholder="Username (Email)" onChange={handleChange} required />
                            <Form.Text className="text-muted">You can use letters, numbers & periods</Form.Text>
                        </Form.Group>

                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-4">
                                    <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} required minLength={6} />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-4">
                                    <Form.Control type="password" name="confirmPassword" placeholder="Confirm" onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/login">Sign in instead</Link>
                            <Button variant="primary" type="submit">
                                Next
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
