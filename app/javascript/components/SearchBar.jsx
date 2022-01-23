import React, { useState } from "react";
import { Row, Col, Form, Button, Badge } from "react-bootstrap";

function SearchBar({ setSearchParams, subjects }) {
    const [overdue, setOverdue] = useState(true);
    const [important, setImportant] = useState(true);
    const [flagged, setFlagged] = useState(true);
    const [rest, setRest] = useState(true);
    const [complete, setComplete] = useState(true);

    const handleOverdueClick = () => {
        setSearchParams({q: document.getElementById("title").value, s: document.getElementById("subject").value, d: !overdue, i: important, f: flagged, o: rest, c: complete});
        setOverdue(!overdue);
    }

    const handleImportantClick = () => {
        setSearchParams({q: document.getElementById("title").value, s: document.getElementById("subject").value, d: overdue, i: !important, f: flagged, o: rest, c: complete});
        setImportant(!important);
    }
    
    const handleFlaggedClick = () => {
        setSearchParams({q: document.getElementById("title").value, s: document.getElementById("subject").value, d: overdue, i: important, f: !flagged, o: rest, c: complete});
        setFlagged(!flagged);
    }

    const handleRestClick = () => {
        setSearchParams({q: document.getElementById("title").value, s: document.getElementById("subject").value, d: overdue, i: important, f: flagged, o: !rest, c: complete});
        setRest(!rest);
    }

    const handleCompleteClick = () => {
        setSearchParams({q: document.getElementById("title").value, s: document.getElementById("subject").value, d: overdue, i: important, f: flagged, o: rest, c: !complete});
        setComplete(!complete);
    }

    return(
        <Form className="searchbar">
            <Row className="align-items-center">
                <Col lg={4} md={8} xs ={7}>
                <Form.Group>
                    <Form.Text htmlFor="subject" className="text-muted">Filter by task title</Form.Text>
                    <Form.Control type="search" name="q" id="title" placeholder="Search tasks by title" onChange={(e) => setSearchParams({q: e.target.value, s: document.getElementById("subject").value, d: overdue, i: important, f: flagged})} autoComplete="false"/>
                </Form.Group>
                </Col>
                <Col lg={2} md={4} xs={5}>
                <Button type="submit" placeholder="Search">Search</Button>
                </Col>
                <Col lg={2}>
                    <Form.Text htmlFor="subject" className="text-muted">Filter by subject</Form.Text>
                    <Form.Select name="s" id="subject" onChange={(e) => setSearchParams({q: document.getElementById("title").value, s: e.target.value, d: overdue, i: important, f: flagged})}>
                        <option value="null">None</option>
                        {
                            subjects
                            ? subjects.map((subject) => 
                                <option value={subject.id} key={subject.id}>{subject.title}</option>
                            )
                            : null
                        }
                    </Form.Select>
                </Col>
                <Col lg={4}>
                    <Row>
                        <Form.Text className="text-muted">Select tags (overdue, important, flagged, hide low/ unprioritised tasks, hide completed task):</Form.Text>
                    </Row>
                    <Badge bg={overdue ? "danger" : "secondary"} pill id="filterOverdueBadge" className="filterOverdueBadge" title="See overdue tasks" onClick={handleOverdueClick} value={overdue}>!</Badge>
                    <Badge bg={important ? "warning" :"secondary"} pill id="filterImportantBadge" className="filterImportantBadge" title="See important tasks" onClick={handleImportantClick} value={important}>*</Badge>
                    <Badge bg={flagged ? "primary" : "secondary"} pill id="filterFlagBadge" className="filterFlagBadge" title="See flagged tasks" onClick={handleFlaggedClick} value={flagged}>Flag</Badge>
                    <Badge bg={rest ? "info" : "secondary"} pill id="filterRestBadge" className="filterRestBadge" title="See low priority/ unprioritised tasks" onClick={handleRestClick} value={rest}>Low/No Priority</Badge>
                    <Badge bg={complete ? "success" : "secondary"} pill className="taskCompletionTick" title="See completed tasks" onClick={handleCompleteClick}>{String.fromCharCode(0x2713)}</Badge>
                </Col>
            </Row>
        </Form>
    );
}

export default SearchBar;