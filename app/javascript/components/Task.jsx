import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Accordion, Table, Form, Button, Col, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import UpdateTask from "./UpdateTask";

function Task() {
    const { task_id } = useParams();
    const [task, setTask] = useState();
    const [subject, setSubject] = useState();
    const [subjects, setSubjects] = useState();
    
    let navigate = useNavigate();
    useEffect(() => getTask(), []);

    const getTask = () => {
        fetch(`http://localhost:3000/dashboard/tasks/${task_id}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if(response.logged_in) {
                if(response.task_found){
                    setTask(response.task);
                    setSubject(response.subject);
                    setSubjects(response.subjects);
                } else {
                    taskNotFound();
                }
            } else {
                throw(response.message);
            }
        })
        .catch(error => console.log('An error occured', error))
    }

    const taskNotFound = () => {
        let timerInterval;
        Swal.fire({
            icon: "error",
            title: "Task not found!",
            timer: 2000,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval);
                navigate("/dashboard");
                window.location.reload();
            }
        });
    }
    
    const deleteTask = () => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(`http://localhost:3000/delete_task/${task_id}`, {
        method: "DELETE",
        headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
        }
        })
        .then(response => response.json())
        .then(response => {
            if(response.deleted) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: "Task successfully deleted!",
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

    const renderPriorityBadge = (priority) => {
        if(priority === "important") {
            return(
                <div style={{display:"inline"}}>
                    <Badge bg="warning" pill data-bs-toggle="tooltip">*</Badge> <text>Important</text>
                </div>
            );
        } else if(priority === "flagged") {
            return(
                <div style={{display:"inline"}}>
                    <Badge bg="primary" pill data-bs-toggle="tooltip">Flagged</Badge> <text>Flagged</text>
                </div>);
        } else if(priority === "low") {
            return(
                <div style={{display:"inline"}}>
                    <Badge bg="info" pill data-bs-toggle="tooltip">Low</Badge> <text>Low</text>
                </div>
            );
        } else {
            return(
                <div style={{display:"inline"}}>
                    <Badge bg="secondary" pill data-bs-toggle="tooltip">None</Badge> <text>None</text>
                </div>);
        }
    }

    const deleteTaskConfirmation = () => {
        Swal.fire({
            title: `Are you sure you want to delete ${task.title}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm Delete'
          }).then((result) => {
            if (result.isConfirmed) {
              deleteTask();
            }
          })
    }

    const changeTaskCompletion = (complete, task_id) => {
        const task = {task_id, completed: complete};
        const token = document.querySelector('meta[name="csrf-token"]').content;
            fetch(`http://localhost:3000/update_task/${task_id}`, {
                method: "PATCH",
                body: JSON.stringify(task),
                headers: {
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then(response => {
                if(response.updated) {
                    let timerInterval;
                    Swal.fire({
                        icon: "success",
                        title: `${complete ? "You completed a task!" : "Successfully marked task as uncompleted!"}`,
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

    const renderCompletionBadge = () => {
        if(task.completed) {
            return(
            <Badge bg="success" pill className="taskCompletedTick" title="completed" onClick={() => changeTaskCompletion(false, task.id)}>{String.fromCharCode(0x2713)}</Badge>
            );
        } else {
            return(
                <Badge bg="secondary" pill className="taskCompletionTick" title="uncompleted" onClick={() => changeTaskCompletion(true, task.id)}>{String.fromCharCode(0x2713)}</Badge>
            );
        }
    }

    const taskView = () => {
        return(
            <Container>
                <Row className="SubjectViewBanner" style={{backgroundColor: "#" + calcBG(subject), color: fontColor(subject)}}>
                    <Col lg={10}>
                        <h1>{task.title} {renderCompletionBadge()}</h1>
                    </Col>
                    <Col lg="auto" style={{display: "flex", alignItems: "end"}}>
                        <button type="button" className="btn btn-danger" onClick={deleteTaskConfirmation}>Delete Task</button>
                    </Col>
                </Row>
                <Row className="SubjectPageBody">
                    <p className="text-muted">{task.description}</p>
                    {subject ? subjectTitle() : null}
                    <text><strong>Priority:</strong> {renderPriorityBadge(task.priority)}</text>
                    <p style={{marginBottom: 0}}><strong>Deadline:</strong> <text style={{color: new Date(task.deadline) < new Date() && !task.completed ? "red" : "black"}}>{new Date(task.deadline).toDateString()}</text></p>
                    <p style={{marginBottom: 0}}><strong>Created at:</strong> {new Date(task.created_at).toDateString()}</p>
                    <p style={{marginBottom: 0}}><strong>Updated at:</strong> {task.updated_at ? new Date(task.updated_at).toDateString() : "-"}</p>
                </Row>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Update Task</Accordion.Header>
                        <Accordion.Body>
                            <UpdateTask task={task} subjects={subjects}/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        );
    }

    return(
        <div>
            {console.log(task)}
            {
                task ? taskView() : null
            }
        </div>
    );
}

export default Task;