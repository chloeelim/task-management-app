import React, { useState }  from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'

function Signup({ handleSubmit }) {
    let navigate = useNavigate();
    // functional component with hooks
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onPasswordConfirmationChange = (e) => {
        setPasswordConfirmation(e.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        // const { username, password, password_confirmation } = this.state;
        const user = {username, password, password_confirmation};
        
        // request will be mapped to the create action of the users controller
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch("http://localhost:3000/users", {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then((response => response.json()))
        .then((response) => {
            if(response.status === 'created') {
                // user account was successfully created
                handleSubmit(response);
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: `Hello ${username}, your account was successfully created! Redirecting you to your dashboard...`,
                    timer: 2000,
                    showCloseButton: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                        navigate("/dashboard");
                        window.location.reload();
                    }
                });
            } else {
                // user account failed to create
                setErrors(response.errors);
            }
        })
        .catch(error => console.log("An error occured.", error));
    }
    
    const allErrors = () => {
        return (
            <ul>
                { errors.map((error) => 
                    (<li key={error}>{ error }</li>)
                )}
            </ul>
        );
    }

    return (
        <Container sm={12} md={6} lg={3} className="login justify-content-center">
            <Row>
                <Col lg={{span: 8, offset: 2}}>
                    <h1>Sign up and get started organising!</h1>
                </Col>
            </Row>
            <Row style={{paddingTop: "1rem", paddingBottom: "1rem"}}>
                <Col lg={{span: 8, offset: 2}}>
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" required onChange={onUsernameChange}/>
                            <Form.Text className="text-muted">
                                Your username should be minimally three characters long and only contain alphanumeric characters, dots(.), or underscores(_).
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required onChange={onPasswordChange} autoComplete="new-password"/>
                        </Form.Group>
                        <Form.Group controlId="password_confirmation" className="mb-3">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control type="password" required onChange={onPasswordConfirmationChange} autoComplete="new-password"/>
                        </Form.Group>
                        <Button className="btn custom-button mt-3" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col lg={{span: 8, offset: 2}}>
                <p>Already have an account? Log in <Link to="/signup">here</Link></p>
                </Col>
            </Row>
            <Row>
                <Col lg={{span: 8, offset: 2}}>
                {
                    errors ? allErrors() : null
                }
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;