import React, { useState } from "react";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

function EventForm({ user_id, handleSubmit, event_presets, subjects }) {
    const [date, setDate] =  useState(event_presets ? event_presets.start_date.slice(0,23) : "");
    const [dateEnd, setDateEnd] = useState(event_presets && event_presets.end_date ? event_presets.end_date.slice(0,23) : "");
    const [eventName, setEventName] = useState(event_presets ? event_presets.title : "");
    const [eventSubject, setEventSubject] = useState(event_presets ? event_presets.subject_id : "");
    const [eventErrors, setEventErrors] = useState([]);
    const [eventDescription, setEventDescription] = useState(event_presets ? event_presets.description : "");

    const onDateChange = (event) => {
        setDate(event.target.value);
    }

    const onDateEndChange = (event) => {
        setDateEnd(event.target.value);
    }

    const onEventNameChange = (event) => {
        setEventName(event.target.value);
    }

    const onEventDescriptionChange = (event) => {
        setEventDescription(event.target.value);
    }

    const onEventSubjectChange = (event) => {
        setEventSubject(event.target.value);
    }

    const onAddDate = (event) => {
        event.preventDefault();
        if(eventName && date && !isNaN(Date.parse(date)) && (!dateEnd || !isNaN(Date.parse(dateEnd))) && (dateEnd >= date || !dateEnd)) {
            // only push event if it has a name and valid start date and end date
            const event = {
                title: eventName,
                description: eventDescription,
                start_date: date,
                end_date: dateEnd,
                description: eventDescription,
                user_id: user_id
            };
            if(subjects) {event.subject_id = eventSubject;}
            setDate("");
            setDateEnd("");
            setEventName("");
            setEventDescription("");
            setEventErrors([]);
            handleSubmit(event);
        } else {
            let err = [];
            if (!eventName) {
                err.push("Event name is required!");
            }
            
            if(!date) {
                err.push("Event start date and time is required!");
            }
            
            if(dateEnd && dateEnd < date) {
                err.push("Start date and time must be before end date and time!");
            }

            if(isNaN(Date.parse(date)) || (dateEnd && isNaN(Date.parse(dateEnd)))) {
                err.push("Date must be valid (DD/MM/YYYY HH:MM tt)");
            }

            setEventErrors(err);
        }
    }

    const selectSubject = () => {
        return(
            <Form.Group>
                <Form.Label htmlFor="subjectTitle">Subject:</Form.Label>
                <Form.Select id="subjectTitle" name="subjectTitle" onChange={onEventSubjectChange} value={eventSubject}>
                    <option value={null}>Unfiled</option>
                    {
                        subjects.map((subject) => (
                            <option value={subject.id} key={subject.id}>{subject.title}</option>
                        ))
                    }
                </Form.Select>
            </Form.Group>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    <div>
                        <ul>
                            {
                                eventErrors.map((e, index) => (
                                    <li key={index}>{e}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <Form onSubmit={onAddDate}>
                        <Form.Group>
                            <Form.Label htmlFor="eventName">Event Title:</Form.Label>
                            <Form.Control type="text" name="eventName" id="eventName" onChange={onEventNameChange} value={eventName}/>
                        </Form.Group>
                        {
                            subjects
                            ? selectSubject()
                            : null
                        }
                        <Form.Group>
                            <Form.Label htmlFor="event_description">Description: (optional)</Form.Label>
                            <Form.Control as="textarea" name="event_description" id="event_description" onChange={onEventDescriptionChange} value={eventDescription}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="date">Start date and time:</Form.Label>
                            <Form.Control type="datetime-local" name="date" id="date" onChange={onDateChange} value={date}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="date_end">End date and time: (optional)</Form.Label>
                            <Form.Control type="datetime-local" name="date_end" id="date_end" onChange={onDateEndChange} value={dateEnd}/>
                        </Form.Group>
                        <Button type="submit" placeholder="submit" className="submitFormButton" onClick={onAddDate}>Add Event</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EventForm;