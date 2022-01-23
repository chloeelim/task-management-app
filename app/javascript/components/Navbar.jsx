import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";

function NavBar({ loginStatus, user, handleLogout }) {
    let navigate = useNavigate();

    const logoutButton = () => {
        console.log("logout");
        return(
            <Button onClick={onLogout} variant="light">Log out</Button>
        );
    }
    
    const onLogout = () => {
        // log the user out on the back-end by clearing session
        // calls the delete action of the sessions controller
        fetch('http://localhost:3000/logout', {
            method: "DELETE",
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.status === 200) {
                // session successfully destroyed
                handleLogout()
                navigate("/");
            } else {
                console.log("An error occured. Redirecting you back.");
                navigate("/");
            }
        })
        .catch(error => console.log("An error occured.", error));
    }

    return (
        <Navbar bg="light" variant="light" sticky="top" expand="sm" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/GNOME_Todo_icon_2019.svg/256px-GNOME_Todo_icon_2019.svg.png"
                    width="50"
                    height="50"
                    className="d-inline-block align-middle"
                    />{' '}
                    didit
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav variant="tabs" className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                { loginStatus ? logoutButton() : null }
            </Container>
        </Navbar>
    );
}

export default NavBar;