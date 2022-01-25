import React, { useState } from "react";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import Swal from "sweetalert2";

function EditTask({ user_id, task_presets, subjects, handleSubmit }) {
    const [title, setTitle] = useState(task_presets.title);
    const [description, setDescription] = useState(task_presets.description);
    const [deadline, setDeadline] = useState(task_presets.deadline);
    const [subjectId, setSubjectId] = useState(task_presets.subject_id);
    const [priority, setPriority] = useState(task_presets.priority);
    const [completed, setCompleted] = useState(task_presets.completed);

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const onDeadlineChange = (e) => {
        setDeadline(e.target.value);
    }

    const onSubjectIdChange = (e) => {
        setSubjectId(e.target.value);
    }
    
    const onPriorityChange = (e) => {
        setPriority(e.target.value);
    }

    const onCompletedChange = (e) => {
        setCompleted(e.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        // check for valid date
        const d = Date.parse(deadline);
        if(!isNaN(d)) {
            const subject_id = (subjectId === "Unfiled" || !subjectId) ? null : subjectId; 
            const task = { title, description, deadline, subject_id, priority, completed, user_id };
            handleSubmit(JSON.stringify({task}));
        } else {
            Swal.fire({
                icon: "warning",
                title: "Please use a valid year"
            });
        }
    }

    return (
        <Container>
            <Row>
                <Form onSubmit={onSubmit}>
                    <Row>
                    <Form.Group>
                        <Form.Label htmlFor="title">Task:</Form.Label>
                        <Form.Control type="string" name="title" id="title" required onChange={onTitleChange} value={title}/>
                    </Form.Group>
                    </Row>
                    <Row>
                    <Form.Group>
                        <Form.Label htmlFor="description">Enter a description for your task:</Form.Label>
                        <Form.Control as="textarea" name="description" id="description" onChange={onDescriptionChange} value={description}/>
                    </Form.Group>
                    </Row>
                    <Row>
                    <Col lg={6}>
                    <Form.Group>
                        <Form.Label htmlFor="deadline">Deadline:</Form.Label>
                        <Form.Control type="datetime-local" name="deadline" id="deadline" required onChange={onDeadlineChange} value={deadline ? deadline.slice(0,23) : deadline}/>
                    </Form.Group>
                    </Col>
                    {
                        subjects
                        ? (
                            <Col lg={3}>
                            <Form.Group>
                                <Form.Label htmlFor="subjectTitle">Subject:</Form.Label>
                                <Form.Select id="subjectTitle" name="subjectTitle" onChange={onSubjectIdChange} value={subjectId}>
                                    <option value={null}>Unfiled</option>
                                    {
                                        subjects.map((subject) => (
                                            <option value={subject.id} key={subject.id}>{subject.title}</option>
                                        ))
                                    }
                                </Form.Select>
                                </Form.Group>
                                </Col>
                        )
                        : null
                    }
                    <Col lg="auto">
                    <Form.Group>
                        <Form.Label htmlFor="priority">Priority:</Form.Label>
                        <Form.Select id="priority" name="priority" onChange={onPriorityChange}>
                            <option value="none"></option>
                            <option value="important">important</option>
                            <option value="flag">flag</option>
                            <option value="low">low</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    </Row>
                    <Form.Group>
                    <Form.Check inline label="Completed" type="radio" id="completed" name="completed" value={true} onChange={onCompletedChange} defaultChecked={completed}/>
                    <Form.Check inline label="Incomplete" type="radio" id="uncompleted" name="completed" value={false} onChange={onCompletedChange} defaultChecked={!completed}/>
                    </Form.Group>
                    <Button type="submit" placeholder="Submit" className="submitFormButton">Submit task</Button>
                </Form>
            </Row>
        </Container>
    );
}

export default EditTask;