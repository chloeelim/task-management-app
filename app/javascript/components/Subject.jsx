import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Accordion, Table, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import EditSubject from "./EditSubject";

function Subject() {
    const { subject_id } = useParams();
    const [subject, setSubject] = useState([]);
    const [events, setEvents] = useState();
    
    let navigate = useNavigate();
    useEffect(() => getSubject(), []);

    const getSubject = () => {
        fetch(`/dashboard/subjects/${subject_id}`)
        .then(response => response.json())
        .then(response => {
            if(response.subject_found){
                setSubject(response.subject);
                setEvents(response.events);
            } else {
                subjectNotFound();
            }
        })
        .catch(error => console.log('An error occured', error))
    }

    const subjectNotFound = () => {
        let timerInterval;
        Swal.fire({
            icon: "error",
            title: "Subject not found!",
            timer: 2000,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval);
                navigate("/dashboard");
                window.location.reload();
            }
        });
    }
    
    const confirmDeleteSubject = () => {
        Swal.fire({
            title: `Are you sure you want to delete ${subject.title}?`,
            text: "You won't be able to revert this! All tasks and events under this subject will not be deleted, but they will be unfiled.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm delete'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSubject();
            }
        });
    }
    
    const deleteSubject = () => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(`/delete_subject/${subject_id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.subject_deleted) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: "Subject successfully deleted!",
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

    const fontColor = (hex) => {
        if(hex) {
            const luminance = (0.2126 * parseInt(hex.slice(0,2),16) + 0.7152 * parseInt(hex.slice(2,4),16) + 0.0722 * parseInt(hex.slice(4,6), 16)) / 255;
            return luminance > 0.6 ? "black" : "white";
        } else {
            return "black";
        }
    }

    const onSubmit = (subject) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        return fetch(`/new_subject/${subject_id}`, {
                method: "PATCH",
                body: JSON.stringify(subject),
                headers: {
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                credentials: "include"
        });
    }

    const calcStatus = (sd, ed) => {
        const d = new Date();
        if(new Date(sd) > d) {
            return "Upcoming";
        } else if(ed && new Date(ed) > d) {
            return "Ongoing";
        } else {
            return "Past";
        }
    }

    return(
        <Container className="SubjectPage">
            <Row className="SubjectViewBanner" style={{backgroundColor: "#" + subject.color, color: fontColor(subject.color)}}>
                <Col lg={10}>
                    <h1>{subject ? subject.title : null}</h1>
                </Col>
                <Col lg="auto" style={{display: "flex", alignItems: "end"}}>
                    <button type="button" className="btn btn-danger" onClick={confirmDeleteSubject}>Delete Subject</button>
                </Col>
            </Row>
            <Row className="SubjectPageBody">
                <Row>
                <p className="text-muted">{subject ? subject.description : null}</p>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            Array.isArray(events)
                            ? events.map((event) => (
                                <tr onClick={() => navigate(`/events/${event.id}`)}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{new Date(event.start_date).toDateString()}</td>
                                    <td>{event.end_date ? new Date(event.end_date).toDateString() : "-"}</td>
                                    <td>{calcStatus(event.start_date, event.end_date)}</td>
                                </tr>
                            ))
                            : null
                        }
                    </tbody>
                </Table>
                </Row>
                <Row>
                {   subject && events
                    ? <Row>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Update {subject.title}</Accordion.Header>
                                <Accordion.Body>
                                    <EditSubject subject_presets={subject} subject_events={events} user_id={subject.user_id} onSubmit={onSubmit} request_method="PATCH" id={subject_id}/>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Row> 
                    : null
                }
                </Row>
            </Row>
        </Container>
    );
}

export default Subject;