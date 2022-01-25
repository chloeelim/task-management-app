import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import Swal from "sweetalert2";
import EventForm from "./EventForm";

function EditSubject({ user_id, subject_presets, onSubmit, subject_events, request_method, id }) {
    const [title, setTitle] = useState(subject_presets.title);
    const [description, setDescription] = useState(subject_presets.description);
    const [color, setColor] = useState(subject_presets.color);
    const [events, setEvents] = useState(subject_events ||= []);
    let navigate = useNavigate();

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const onColorChange = (e) => {
        setColor(e.target.value.slice(1));
    }

    const addNewEvent = (event) => {
        console.log(event);
        const new_arr = [...events, event];
        setEvents(new_arr);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const subject = { title, description, color, user_id };
        onSubmit(subject)
        .then(response => response.json())
        .then(response => {
            if(response.successful || response.subject_created) {
                console.log(response.subject_id);
                submitAllEvents(response.subject_id);
            } else {
                let timerInterval;
                Swal.fire({
                    icon: "error",
                    title: `${response.message}`,
                    timer: 2000,
                    showCloseButton: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                        window.location.reload();
                    }
                });
            }
        })
        .catch(error => console.log("An error occured", error));
    }

    const submitAllEvents = (subject_id) => {
        console.log(subject_id);
        const new_events = events.filter(x => !subject_events.includes(x));
        console.log(new_events);
        new_events.map((event) => {
            event.subject_id = subject_id;
            event.user_id = user_id;
            const token = document.querySelector('meta[name="csrf-token"]').content;
            fetch("/new_event", {
                method: "POST",
                body: JSON.stringify(event),
                headers: {
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then(response => {
                if(!response.successful) {
                    let timerInterval;
                    Swal.fire({
                        icon: "error",
                        title: `${response.message}`,
                        timer: 2000,
                        showCloseButton: true,
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    });
                }
            })
            .catch(error => console.log("An error occured", error));
        });
        let timerInterval;
        Swal.fire({
            icon: "success",
            title: "subject created successfully",
            timer: 2000,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval);
                window.location.reload();
            }
        });
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={2}>
                    <Form.Group>
                        <Row>
                        <Form.Label htmlFor="color">Subject Color:</Form.Label>
                        </Row>
                        <Row>
                        <Col lg={3}/>
                        <Col lg={9}>
                            <Form.Control type="color" name="color" id="color" required onChange={onColorChange} value={color ? "#" + color : "#000000"}/>
                        </Col>
                        </Row>
                    </Form.Group>
                    </Col>
                    <Col lg={10}>
                        <Form.Group>
                            <Form.Label htmlFor="title">Subject:</Form.Label>
                            <Form.Control type="string" name="title" id="title" required onChange={onTitleChange} value={title}/>
                        </Form.Group>
                    </Col>
                    <Form.Group>
                        <Form.Label htmlFor="description">Enter a description for your subject:</Form.Label>
                        <Form.Control as="textarea" name="description" id="description" onChange={onDescriptionChange} value={description}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Col lg={3}/>
                    <Col lg={6}>
                        <div>
                            <dl>
                                {
                                    events.map((e) => (
                                        <div>
                                            <dt key={e} onClick={() => navigate(`/events/${e.id}`)}>Added Event: {e.title} (Start: {(new Date(e.start_date)).toLocaleString()}{e.end_date ? <time>, Ends:{(new Date(e.end_date)).toLocaleString()}</time> : null})</dt>
                                            <dd key={e.description}>{ e.description }</dd>
                                        </div>
                                    ))
                                }
                            </dl>
                        </div>
                        <div>
                            <EventForm handleSubmit={addNewEvent}/>
                        </div>
                    </Col>
                    <Col lg={3}/>
                </Row>
                <Button type="submit" placeholder="submit" className="submitFormButton">Submit Subject</Button>
            </Form>
        </Container>
    );
}

export default EditSubject;