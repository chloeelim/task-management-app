import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Tab, ListGroup, OverlayTrigger, Tooltip, Col, Badge, CloseButton } from "react-bootstrap";
import Swal from "sweetalert2";

function TaskOverview({allTasks, subjects, searchParams}) {
    const [tabsOpen, setTabsOpen] = useState(false);
    const showOverdueTasks = !searchParams.get('d') || searchParams.get('d') === "true" ? true : false;
    const showImportantTasks = !searchParams.get('i') || searchParams.get('i') === "true" ? true : false;
    const showFlaggedTasks = !searchParams.get('f') || searchParams.get('f') === "true" ? true : false;
    const showOtherTasks = !searchParams.get('o') || searchParams.get('o') === "true" ? true : false;
    const showCompletedTasks = !searchParams.get('c') || searchParams.get('c') === "true" ? true : false;
    let navigate = useNavigate();

    const subjectFind = (subjectId) => {
        if(subjects) {
            const sub = subjects.find((subject) => subject.id === subjectId);
            if(sub) {
                return sub;
            } else {
                return {color: null};
            }
        } else {
            return {color: null};
        }
    }

    const generatePane = (task) => {
        const subject = subjectFind(task.subject_id);
        if(subject.color) {
            return(
                <Tab.Pane eventKey={"#" + task.id} id={task.id} style={{backgroundColor: "#" + subject.color, color: fontColor(subject.color)}} className="quickSubjectOverview">
                    <CloseButton onClick={() => setTabsOpen(false)}/>
                    <h3>{task.title}</h3>
                    <br/>
                    <p><strong>{task.completed ? "Completed" : "Uncompleted"}</strong></p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toDateString() : "unset"}</p>
                    <p><strong>Subject:</strong> {subject.title}   <u onClick={() => navigate(`/subjects/${subject.id}`)}>(Go to Subject)</u> </p>
                    <p><strong>Description:</strong> {task.description}</p>
                    <p><strong>Created on:</strong> {new Date(task.created_at).toDateString()}</p>
                    <p><strong>Updated on:</strong> {task.updated_on ? new Date(task.updated_on).toDateString() : "-"}</p>
                    <u onClick={() => navigate(`/tasks/${task.id}`)}>See more/ Edit Task</u>
                </Tab.Pane>
            );
        } else {
            return(
                <Tab.Pane eventKey={"#" + task.id} id={task.id} style={{backgroundColor: "beige", color: "black"}} className="quickSubjectOverview">
                    <CloseButton onClick={() => setTabsOpen(false)}/>
                    <h3>{task.title}</h3>
                    <br/>
                    <p><strong>{task.completed ? "Completed" : "Uncompleted"}</strong></p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toDateString() : "unset"}</p>
                    <p><strong>Subject:</strong> unfiled</p>
                    <p><strong>Description:</strong> {task.description}</p>
                    <p><strong>Created on:</strong> {new Date(task.created_at).toDateString()}</p>
                    <p><strong>Updated on:</strong> {task.updated_on ? new Date(task.updated_on).toDateString() : "-"}</p>
                    <u onClick={() => navigate(`/tasks/${task.id}`)}>See more/ Edit Task</u>
                </Tab.Pane>
            );
        }
    }

    const fontColor = (hex) => {
        const luminance = (0.2126 * parseInt(hex.slice(0,2),16) + 0.7152 * parseInt(hex.slice(2,4),16) + 0.0722 * parseInt(hex.slice(4,6), 16)) / 255;
        return luminance > 0.6 ? "black" : "white";
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

    const uncompletedBadge = (taskId) => {
        return(
            <Badge bg="secondary" pill className="taskCompletionTick" title="uncompleted" onClick={() => changeTaskCompletion(true, taskId)}>{String.fromCharCode(0x2713)}</Badge>
        );
    }

    const taskList = (tasks) => {
        return(
            <Container>
            <Tab.Container id="list-group-tabs-example">
                <Row>
                    <Col xs={12} md={tabsOpen ? 8 : 12} lg={tabsOpen ? 8 : 12} style={{maxHeight: "25rem", overflowY: "auto"}}>
                        <ListGroup>
                        {
                            showOverdueTasks
                            ? tasks.map((task) => {
                                if(!task.completed && task.deadline && new Date(task.deadline) < new Date()) {
                                    return(
                                    <ListGroup.Item href={"#" + task.id} key={task.id} className="overdueTask d-flex justify-content-between align-items-start" onClick={() => setTabsOpen(true)}>
                                        <div className="ms-2 me-auto">
                                            <span className="dot" style={{backgroundColor: "#"+ subjectFind(task.subject_id).color}}></span>
                                            {task.title}
                                        </div>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="overdue">Overdue by {calcDateDiff(new Date() - new Date(task.deadline))}!</Tooltip>}>
                                            <Badge bg="danger" pill data-bs-toggle="tooltip">!</Badge>
                                        </OverlayTrigger>
                                        {
                                            task.priority !== "none"
                                            ? (task.priority === "important"
                                            ? <OverlayTrigger placement="bottom" overlay={<Tooltip id="overdue">Important task</Tooltip>}>
                                                <Badge bg="warning" pill data-bs-toggle="tooltip">*</Badge>
                                            </OverlayTrigger>
                                            : task.priority === "flag"
                                            ? <OverlayTrigger placement="bottom" overlay={<Tooltip id="overdue">Flagged task</Tooltip>}>
                                                <Badge bg="primary" pill data-bs-toggle="tooltip">Flag</Badge>
                                            </OverlayTrigger>
                                            : null)
                                            : null
                                        }
                                        {uncompletedBadge(task.id)}
                                    </ListGroup.Item>
                                    )
                                }
                            })
                            : null
                        }
                        {
                            showImportantTasks || showFlaggedTasks
                            ? tasks.map((task) => {
                                if(!task.completed && (!task.deadline || new Date(task.deadline) > new Date()) && ((task.priority === "flag" && showFlaggedTasks) || (task.priority === "important" && showImportantTasks))) {
                                    return(
                                        <ListGroup.Item href={"#" + task.id} key={task.id} className="d-flex justify-content-between align-items-start" onClick={() => setTabsOpen(true)}>
                                            <div className="ms-2 me-auto">
                                                <span className="dot" style={{backgroundColor: "#"+ subjectFind(task.subject_id).color}}></span>
                                                {task.title}
                                            </div>
                                            {
                                                task.priority === "important"
                                                ? <OverlayTrigger placement="bottom" overlay={<Tooltip id="overdue">Important task</Tooltip>}>
                                                    <Badge bg="warning" pill data-bs-toggle="tooltip">*</Badge>
                                                </OverlayTrigger>
                                                : <OverlayTrigger placement="bottom" overlay={<Tooltip id="overdue">Flagged task</Tooltip>}>
                                                    <Badge bg="primary" pill data-bs-toggle="tooltip">Flag</Badge>
                                                </OverlayTrigger>
                                            }
                                            {uncompletedBadge(task.id)}
                                        </ListGroup.Item>
                                    );
                                }
                            })
                            : null
                        }
                        {
                            showOtherTasks
                            ? tasks.map((task) => {
                                if(!task.completed && (!task.deadline || new Date(task.deadline) > new Date()) && (task.priority==="none" || task.priority==="low")) {
                                    return(
                                        <ListGroup.Item href={"#" + task.id} key={task.id} className="d-flex justify-content-between align-items-start" onClick={() => setTabsOpen(true)}>
                                            <div className="ms-2 me-auto">
                                                <span className="dot" style={{backgroundColor: "#"+ subjectFind(task.subject_id).color}}></span>
                                                {task.title}
                                            </div>
                                            {uncompletedBadge(task.id)}
                                        </ListGroup.Item>
                                    );
                                }
                            })
                            : null
                        }
                        {
                            showCompletedTasks
                            ? tasks.map((task) => {
                                if(task.completed) {
                                    return(
                                        <ListGroup.Item href={"#" + task.id} key={task.id} className="d-flex justify-content-between align-items-start" style={{backgroundColor: "gainsboro"}} onClick={() => setTabsOpen(true)}>
                                            <div className="ms-2 me-auto">
                                                <span className="dot" style={{backgroundColor: "#"+ subjectFind(task.subject_id).color}}></span>
                                                {task.title}
                                            </div>
                                            <Badge bg="success" pill className="taskCompletedTick" title="completed" onClick={() => changeTaskCompletion(false, task.id)}>{String.fromCharCode(0x2713)}</Badge>
                                        </ListGroup.Item>
                                    );
                                }
                            })
                            : null
                        }
                        </ListGroup>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{alignSelf: "center", display: tabsOpen ? "" : "none"}}>
                        <Tab.Content>
                            {
                                tasks.map((task) => generatePane(task))
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
        );
    }

    const noTasks = () => {
        return(
            <Container>
                <Row>
                    <h1 style={{color: "grey", textAlign: "center"}}>No tasks found</h1>
                </Row>
            </Container>
        );
    }

    const filterSearchList = () => {
        if(searchParams.get('q') && searchParams.get('s') && searchParams.get('s') !== "null") {
            const filtered = allTasks.filter((task) => task.title.toLowerCase().includes(searchParams.get('q').toLowerCase()) && task.subject_id - searchParams.get('s') === 0);
            if(filtered && filtered.length) {
                return taskList(filtered);
            } else {
                // no matching tasks found
                return <h1>No matching tasks found</h1>;
            }
        } else if(searchParams.get('q')) {
            const filtered = allTasks.filter((task) => task.title.toLowerCase().includes(searchParams.get('q').toLowerCase()));
            if(filtered && filtered.length) {
                return taskList(filtered);
            } else {
                // no matching tasks found
                return <h1>No matching tasks found</h1>;
            }
        } else if (searchParams.get('s') && searchParams.get('s') !== "null") {
            const filtered = allTasks.filter((task) => task.subject_id - searchParams.get('s') === 0);
            if(filtered && filtered.length) {
                return taskList(filtered);
            } else {
                // no matching tasks found
                return <h1>No matching tasks found</h1>;
            }
        } else {
            return taskList(allTasks);
        }
    }

    return(
        <div>
            {
                !allTasks || allTasks.length === 0 ? noTasks() : filterSearchList()
            }
        </div>
    );
}

export default TaskOverview;