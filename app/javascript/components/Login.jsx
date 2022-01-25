import React, { useEffect, useState }  from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Row, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'

function Login({ handleSubmit, loginStatus }) {
    let navigate = useNavigate();
    // functional component with hooks
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => { 
        loginStatus ? handleUserLoggedIn() : null;
    });

    const handleUserLoggedIn = () => {
        let timerInterval;
        Swal.fire({
            title: "Looks like you're already logged in, redirecting you back!",
            icon: "warning",
            timer: 2000,
            timerProgressBar: true,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then(() => navigate("/dashboard"));
    }

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const user = {username, password};
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        // request will be mapped to the create action of the session controller (attempts to create a session)
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch("/login", {
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
            if(response.logged_in) {
                // user successfully logged in
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                }).then(() => {
                    navigate("/dashboard");
                    window.location.reload();
                    handleSubmit(response);
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
        <Container className="login sm-12 md-6 lg-3">
            <Row>
                <h1>Login</h1>
            </Row>
            <Row style={{paddingTop: "1rem", paddingBottom: "1rem"}}>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" onChange={onUsernameChange} required autoComplete="username"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={onPasswordChange} required autoComplete="current-password"/>
                </Form.Group>
                <Button className="btn custom-button mt-3" type="submit">Submit</Button>
            </Form>
            </Row>
            <Row>
                <p>Don't have an account just yet? Create one <Link to="/signup">here</Link></p>
            </Row>
            <Row>
                {
                    errors ? allErrors() : null
                }
            </Row>
        </Container>
    );
}

export default Login;