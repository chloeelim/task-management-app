import React, { useEffect, useState }  from "react";
import { Container, Row, Accordion, ListGroup, Form, Button, Col } from "react-bootstrap";
import Swal from "sweetalert2";

function CreateSubject({ user_id }) {
    const [moduleCode, setModuleCode] = useState();
    const [sem, setSem] = useState();
    const [AY, setAY] = useState();
    const [moduleName, setModuleName] = useState();
    const [moduleDescription, setModuleDescription] = useState();
    const [moduleExamDate, setModuleExamDate] = useState();
    const [moduleExamDuration, setModuleExamDuration] = useState();
    const [moduleExamEndDate, setModuleExamEndDate] = useState();
    const [moduleSemData, setModuleSemData] = useState();
    const [moduleColor, setModuleColor] = useState(Math.floor(Math.random()*16777215).toString(16));

    useEffect(() => calculateAY(new Date()), []);

    function calculateAY(date) {
        if(date.getMonth() > 8) {
            // sem 1
            const y1 = date.getFullYear();
            const y2 = y1 + 1;
            setSem(1);
            setAY(y1 + "-" + y2);
        } else {
            // sem 2
            const y2 = date.getFullYear();
            const y1 = (y2 - 1);
            setSem(2);
            setAY(y1 + "-" + y2);
        }
    }

    const handleModuleCodeChange = (e) => {
        setModuleCode(e.target.value.toUpperCase());
    }

    const handleModSubmit = (event) => {
        event.preventDefault();
        setModuleName();
        setModuleDescription();
        setModuleExamDate();
        setModuleExamDuration();
        setModuleExamEndDate();
        setModuleSemData();
        setModuleColor(Math.floor(Math.random()*16777215).toString(16));
        fetch(`https://api.nusmods.com/v2/${AY}/modules/${moduleCode}.json`)
        .then(response => response.json())
        .then(response => {
            setModuleName(response.moduleCode + " " + response.title);
            setModuleDescription(response.description);
            setModuleSemData(response.semesterData[sem - 1]);
            setModuleExamDate(response.semesterData[sem - 1].examDate);
            setModuleExamDuration(response.semesterData[sem - 1].examDuration);
            setModuleExamEndDate(calculateExamEndDate(response.semesterData[sem - 1].examDate, response.semesterData[sem - 1].examDuration));
        })
        .catch((error) => console.log("an error occured", error));
    }

    const handleModuleDescriptionChange = (e) => {
        setModuleDescription(e.target.value);
    }

    const handleModuleTitleChange = (e) => {
        setModuleName(e.target.value);
    }

    const handleModuleExamDateChange = (e) => {
        setModuleExamDateChange(e.target.value);
    }

    const handleModuleExamEndDateChange = (e) => {
        setModuleExamEndDate(e.target.value);
    }

    const calculateExamStartDate = (moduleExamDate) => {
        if(moduleExamDate) {
            console.log(moduleExamDate);
            const d = new Date(moduleExamDate);
            const YYYY = d.getFullYear().toString();
            const MM = d.getMonth() < 9 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
            const DD = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
            const hh = d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours().toString();
            const mm = d.getMinutes() < 10 ? "0" + d.getMinutes().toString(): d.getMinutes().toString();
            return YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm;
        } else {
            return null;
        }
    }

    const calculateExamEndDate = (s, dur) => {
        if(s && dur) {
            const sd = new Date(s);
            sd.setMinutes(sd.getMinutes() + dur);
            console.log(sd.toLocaleString());
            return sd.toISOString();
        } else {
            return undefined;
        }
    }

    const handleModuleColorChange = (e) => {
        setModuleColor(e.target.value.slice(1));
    }

    const handleSubjectCreation = (event) => {
        event.preventDefault();
        // first, create the subject
        const subject = { 
            title: moduleName, 
            color: moduleColor,
            description: moduleDescription,
            user_id: user_id
        };
        const token = document.querySelector('meta[name="csrf-token"]').content;
        
        fetch("http://localhost:3000/new_subject", {
                method: "POST",
                body: JSON.stringify({subject}),
                headers: {
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.subject_created && moduleExamDate) {
                submitExamEvent(response.subject_id);
            } else if(response.subject_created) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: `Successfully created ${moduleName}!`,
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
        .catch(error => console.log("An error occured", error));
    }

    const submitExamEvent = (subject_id) => {
        const event = {
            title: moduleName + " Examination",
            start_date: moduleExamDate,
            end_date: moduleExamEndDate,
            subject_id: subject_id,
            user_id: user_id
        }
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch("http://localhost:3000/new_event", {
            method: "POST",
            body: JSON.stringify({event}),
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.successful) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: "Subject created successfully",
                    timer: 2000,
                    showCloseButton: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                        window.location.reload();
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to create subject/ event",
                    showCloseButton: true
                });
            }
        })
        .catch(error => console.log("An error occured", error));
    }

    return(
        <Container>
            <Row>
                <Form onSubmit={handleModSubmit}>
                    <Row>
                        <Col lg={6}>
                            <Form.Group>
                                <Form.Label htmlFor="moduleCode">NUS Module Code:</Form.Label>
                                <Form.Control type="text" id="moduleCode" name="moduleCode" required onChange={handleModuleCodeChange} value={moduleCode}/>
                            </Form.Group>
                        </Col>
                        <Col lg={6} style={{alignItems: "end", display: "flex"}}>
                            <Button type="submit" variant="primary" className="mb-2">Search NUSMODS</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row>
                {
                    moduleName
                    ? <Container>
                        <Form onSubmit={handleSubjectCreation}>
                            <Form.Group>
                                <Form.Label htmlFor="title" className="text-muted">Module Title:</Form.Label>
                                <Form.Control id="title" name="title" type="string" required value={moduleName} onChange={handleModuleTitleChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="description" className="text-muted">Module Description:</Form.Label>
                                <Form.Control id="description" name="description" as="textarea" value={moduleDescription} onChange={handleModuleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="examDate" className="text-muted">Exam Start Date:</Form.Label>
                                <Form.Control id="examDate" name="examDate" type="datetime-local" onChange={handleModuleExamDateChange} defaultValue={calculateExamStartDate(moduleExamDate)} min="1000-01-00T10:00" max="3000-01-00T10:00"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="examEndDate" className="text-muted">Exam End Date:</Form.Label>
                                <Form.Control id="examEndDate" name="examEndDate" type="datetime-local" onChange={handleModuleExamEndDateChange} defaultValue={calculateExamStartDate(moduleExamEndDate)} min="1000-01-00T10:00" max="3000-01-00T10:00"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="moduleColorCode" className="text-muted">Select a colour code for your module:</Form.Label>
                                <Form.Control id="moduleColorCode" name="moduleColorCode" type="color" required onChange={handleModuleColorChange} value={"#" + moduleColor}/>
                            </Form.Group>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Container>
                    : null
                }
            </Row>
        </Container>
    )
}

export default CreateSubject;