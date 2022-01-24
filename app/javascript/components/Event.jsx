import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Accordion, Table, Form, Button, Col, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import EventForm from "./EventForm";

function Event() {
    const { event_id } = useParams();
    const [event, setEvent] = useState();
    const [subject, setSubject] = useState({});
    const [subjects, setSubjects] = useState();
    
    let navigate = useNavigate();
    useEffect(() => getEvent(), []);

    const getEvent = () => {
        fetch(`/dashboard/events/${event_id}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if(response.event_found){
                setEvent(response.event);
                setSubject(response.subject);
                setSubjects(response.subjects);
            } else {
                eventNotFound();
            }
        })
        .catch(error => console.log('An error occured', error))
    }

    const eventNotFound = () => {
        let timerInterval;
        Swal.fire({
            icon: "error",
            title: "Event not found!",
            timer: 2000,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval);
                navigate("/dashboard");
                window.location.reload();
            }
        });
    }
    
    const updateEvent = (event) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(`/new_event/${event_id}`, {
            method: "PATCH",
            body: JSON.stringify(event),
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.successful) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: `${event.title} successfully updated`,
                    timer: 2000,
                    showCloseButton: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                        window.location.reload();
                    }
                });
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
        .catch(error => console.log("An error occured", error))
    }

    const confirmDeleteEvent = () => {
        Swal.fire({
            title: `Are you sure you want to delete ${event.title}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm delete'
          }).then((result) => {
            if (result.isConfirmed) {
              deleteEvent();
            }
          });
    }

    const deleteEvent = () => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(`/delete_event/${event_id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.deleted_event) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: `Event successfully deleted!`,
                    timer: 2000,
                    showCloseButton: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                        navigate("/dashboard");
                        window.location.reload();
                    }
                });
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
        .catch(error => console.log("An error occured", error))
    }

    const fontColor = (subject) => {
        if(subject && subject.color) {
            const hex = subject.color;
            const luminance = (0.2126 * parseInt(hex.slice(0,2),16) + 0.7152 * parseInt(hex.slice(2,4),16) + 0.0722 * parseInt(hex.slice(4,6), 16)) / 255;
            return luminance > 0.6 ? "black" : "white";
        } else {
            return "black";
        }
    }

    const calcBG = (subject) => {
        if(subject && subject.color) {
            return subject.color;
        } else {
            return "f2f2f2";
        }
    }

    const subjectTitle = () => {
        return(
            <div>
                <strong>Subject:</strong>
                <span className="dot" style={{backgroundColor: "#" + subject.color, marginLeft: "0.5em"}}></span>
                <u onClick={() => navigate(`/subjects/${subject.id}`)}>{subject.title}</u>
            </div>
        );
    }

    const calcDateDiff = (ms) => {
        const ms_in_h = 60 * 60 * 1000;
        const ms_in_d = ms_in_h * 24;
        const d = Math.floor(ms / ms_in_d);
        const h = Math.floor((ms - d * ms_in_d) / ms_in_h);
        const m = Math.floor((ms - d * ms_in_d - h * ms_in_h) / 60000);

        let result = "";
        if(d !== 0) {
            if(d === 1) {
                result = result + d + " day ";
            } else {
                result = result + d + " days ";
            }
        }

        if(h !== 0) {
            if(h === 1) {
                result = result + h + " hour ";
            } else {
                result = result + h + " hours ";
            }
        }

        if(m !== 0) {
            if(m === 1) {
                result = result + m + " minute";
            } else {
                result = result + m + " minutes";
            }
        }

        return result;
    }

    const calcStatus = (sd, ed) => {
        const d = new Date();
        if(new Date(sd) > d) {
            return(<text style={{color: "dodgerblue"}}>Upcoming in {calcDateDiff(new Date(sd) - d)}</text>);
        } else if(ed && new Date(ed) > d) {
            return(<text style={{color: "green"}}>Ongoing{ed ? ", ends in " + calcDateDiff(new Date(ed) - d) : ""}</text>);
        } else {
            return(<text style={{color: "brown"}}>Past, {calcDateDiff(d - new Date(sd))} ago</text>);
        }
    }

    const eventView = () => {
        return (
            <Container className="SubjectPage">
                <Row className="SubjectViewBanner" style={{backgroundColor: "#" + calcBG(subject), color: fontColor(subject)}}>
                    <Col lg={10}>
                        <h1>{event.title}</h1>
                    </Col>
                    <Col lg="auto" style={{display: "flex", alignItems: "end"}}>
                        <button type="button" placeholder="Delete Event" onClick={confirmDeleteEvent} className="btn btn-danger">Delete Event</button>
                    </Col>
                </Row>
                <Row className="SubjectPageBody">
                    <p className="text-muted">{event.description}</p>
                    <p style={{marginBottom: 0}}><strong>Event status: </strong>{calcStatus(event.start_date, event.end_date)}</p>
                    {subject ? subjectTitle() : null}
                    <p style={{marginBottom: 0}}><strong>Event start date: </strong> {new Date(event.start_date.slice(0,23)).toLocaleString()}</p>
                    <p style={{marginBottom: 0}}><strong>Event end date: </strong>{event.end_date ? new Date(event.end_date.slice(0,23)).toLocaleDateString() : "Not specified"}</p>
                </Row>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Update Event</Accordion.Header>
                        <Accordion.Body>
                            <EventForm user_id={event.user_id} event_presets={event} handleSubmit={updateEvent} subjects={subjects}/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        );
    }

    return (
        <div>
            {event ? eventView() : null}
        </div>
    );
}

export default Event;