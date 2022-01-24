import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect';
import { Container, Row, Form, Button, Col } from "react-bootstrap";
import Login from "./Login";

function Welcome({ loginStatus, handleLogout, user, handleSubmit }) {
    let navigate = useNavigate();

    const onLogout = () => {
        // log the user out on the back-end by clearing session
        // calls the delete action of the sessions controller
        fetch('/logout', {
            method: "DELETE",
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.status === 200) {
                // session successfully destroyed
                handleLogout();
                navigate("/");
            } else {
                console.log("An error occured. Redirecting you back.");
                navigate("/");
            }
        })
        .catch(error => console.log("An error occured.", error));
    }

    return(
        <Container bsPrefix className="fluid banner justify-content-center">
                <input type="checkbox" className="largeCheckbox" id="bannerCheckbox"/>
                <Row style={{fontSize:"xxx-large"}}>
                    <Typewriter
                        options={{
                            autoStart: true,
                            loop: true,
                        }}
                        onInit={(typewriter) => {
                            typewriter
                            .callFunction(() => document.getElementById("bannerCheckbox").checked = false)
                            .typeString('Your to do list')
                            .pauseFor(1000)
                            .deleteChars(10)
                            .typeString('<strong style="color:mediumseagreen;">did it</strong> list')
                            .callFunction(() => document.getElementById("bannerCheckbox").checked = true)
                            .pauseFor(2500)
                            .start();
                        }}
                    />
                </Row>
                <Row className="banner-description justify-content-center">
                    <p>Get on top of your tasks and start organising today with didit!</p>
                    <img src="https://cdn.iconscout.com/icon/free/png-256/task-list-1605712-1361061.png" alt="to do list" style={{width:"12rem", height: "10rem"}}/>
                </Row>
        </Container>
    );
}

export default Welcome;