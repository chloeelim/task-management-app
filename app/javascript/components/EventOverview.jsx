import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Table } from "react-bootstrap";

function EventOverview({ events, subjects }) {
    let navigate = useNavigate();
    const [upcoming, setUpcoming] = useState(true);

    const getSub = (subject_id) => {
        const subject = subjects.find(sub => sub.id === subject_id);
        if(subjects && subject) {
            return (<div><span className="dot" style={{backgroundColor: "#" + subject.color}}></span>{subject.title}</div>);
        } else {
            return "-";
        }
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

    const sortFilterEvents = () => {
        let validEvents = events;
        if(upcoming) {
            const d = new Date();
            validEvents = events.filter((event) => new Date(event.start_date) > d || new Date(event.end_date) > d);
        }

        return validEvents.sort((e0, e1) => new Date(e0.start_date) > new Date(e1.start_date));
    }

    const handleUpcomingChange = () => {
        setUpcoming(!upcoming);
    }

    const eventList = () => {
        return(
            <Container style={{marginBottom: "3rem"}}>
                <h2>Ongoing/ Upcoming Events:</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Subject</th>
                            <th>Event Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortFilterEvents().map((event) =>
                                <tr onClick={() => navigate(`/events/${event.id}`)}>
                                    <td>{event.title}</td>
                                    <td>{getSub(event.subject_id)}</td>
                                    <td>{event.description}</td>
                                    <td>{new Date(event.start_date).toLocaleDateString()}</td>
                                    <td>{event.end_date ? new Date(event.end_date).toLocaleDateString() : null}</td>
                                    <td>{calcStatus(event.start_date, event.end_date)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                <u onClick={handleUpcomingChange}>{upcoming ? "Show all events" : "Show only ongoing and upcoming events"}</u>
            </Container>
        );
    }

    const noEvents = () => {
        return(
            <Container style={{marginBottom: "2rem"}}>
                <Row>
                    <h1 style={{color: "grey", textAlign: "center"}}>No events found</h1>
                </Row>
            </Container>
        );
    }

    return(
        <div>
            {
                events && events.length > 0? eventList() : noEvents()
            }
        </div>
    );
}

export default EventOverview;