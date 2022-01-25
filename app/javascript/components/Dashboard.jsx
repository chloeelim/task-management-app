import React, { useEffect, useState }  from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Row, Accordion, ProgressBar } from "react-bootstrap";
import SubjectOverview from "./SubjectOverview";
import NewTask from "./NewTask";
import TaskOverview from "./TaskOverview";
import NewSubject from "./NewSubject";
import EventOverview from "./EventOverview";
import SearchBar from "./SearchBar";
import EventForm from "./EventForm";
import CreateSubject from "./CreateSubject";
import Swal from "sweetalert2";

function Dashboard({ loginStatus, user }) {
    const [userData, setUserData] = useState();
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState();
    const [events, setEvents] = useState();
    let [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    useEffect(() => requestUserData(), []);

    const requestUserData = () => {
        fetch("/user_data", {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(response.logged_in) {
                setUserData(response.user);
                setTasks(response.tasks);
                setSubjects(response.subjects);
                setEvents(response.events);
            } else {
                failedUserDataRetrival();
            }
        })
        .catch(error => console.log("An error occured", error));
    }

    const failedUserDataRetrival = () => {
        let timerInterval;
        Swal.fire({
            title: "Looks like an error occured, sign in and try again.",
            icon: "warning",
            timer: 2000,
            timerProgressBar: true,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then(() => navigate("/login"));
    }

    const handleUserNotLoggedIn = () => {
        return(
            <Container fluid className="banner">
                <h1>Hmm, looks like you're not logged in</h1>
                <p>Bring me back <Link to="/">home!</Link></p>
            </Container>
        );
    }

    const calculateGreeting = () => {
        const date = new Date();
        if(date) {
            const h = date.getHours();
            if(h >= 6 && h < 12) {
                return "Good Morning";
            } else if(h >= 12 && h < 17) {
                return "Good Afternoon";
            } else if(h >= 17 && h < 20) {
                return "Good Evening";
            } else {
                return "Good Night";
            }
        } else {
            return "Welcome";
        }
    }

    function WelcomeHeader() {
        const greeting = calculateGreeting();
        return(
            <h1 className="welcomeHeader">{greeting} {user.username}. {TaskHeader()}</h1>
        );
    }

    function TaskHeader() {
        if(tasks && tasks.length > 0) {
            const numberTaskRemaining = tasks.filter((task) => !task.completed).length;
            if(numberTaskRemaining > 0) {
                return(`You have ${numberTaskRemaining} tasks left pending!`);
            } else {
                return("You conquered your to do list!");
            }
        } else {
            return("You have no tasks yet, create some to get started!");
        }
    }

    function SubjectHeader() {
        const message = subjects ? `${subjects.length} subjects` : "No subjects yet, created some to get started!";
        return <h2 className="subjectHeader">{message}</h2>;
    }

    const handleEventSubmit = (event) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch("/new_event", {
            method: "POST",
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
                    title: `${response.event_title} successfully created!`,
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

    function Progress() {
        if(tasks && tasks.length > 0) {
            const num_tasks = tasks.length;
            const num_completed = tasks.filter((task) => task.completed).length;
            const p = Math.round((num_completed / num_tasks * 100));
            if(p < 100) {
                return(
                    <div className="ProgressBar">
                        <text className="text-muted">{num_completed} tasks of {num_tasks} tasks ({p}% completed)</text>
                        <ProgressBar now={p}/>
                    </div>
                );
            } else {
                return(
                    <div className="ProgressBar">
                        <text className="text-muted">{num_completed} tasks checked off, you did it! ({p}% completed)</text>
                        <ProgressBar className="ProgressBar" variant="success" now={p}/>
                    </div>
                );
            }
        } else {
            return null;
        }
    }

    const userLoggedIn = () => {
        return(
            <Container fluid>
                <Row>
                    <WelcomeHeader/>
                </Row>
                <Progress/>
                <Row style={{marginBottom: "3rem"}}>
                    <SearchBar setSearchParams={setSearchParams} subjects={subjects} searchParams={searchParams}/>
                    <TaskOverview allTasks={tasks} subjects={subjects} searchParams={searchParams}/>
                </Row>
                <Row className="dashboardForm">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create Task</Accordion.Header>
                            <Accordion.Body>
                                <NewTask userData={userData} subjects={subjects}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
                <Row>
                    <EventOverview events={events} subjects={subjects}/>
                </Row>
                <Row className="dashboardForm">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create Event</Accordion.Header>
                            <Accordion.Body>
                                <EventForm user_id={userData ? userData.id : null} handleSubmit={handleEventSubmit} subjects={subjects}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
                <Row>
                    <SubjectHeader/>
                    <SubjectOverview subjects={subjects} events={events} tasks={tasks}/>
                </Row>
                <Row className="dashboardForm">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create Subject (Manually)</Accordion.Header>
                            <Accordion.Body>
                                <NewSubject userData={userData}/>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Create Subject (via NUSMODS API)</Accordion.Header>
                            <Accordion.Body>
                                <CreateSubject user_id={userData ? userData.id : null}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
            </Container>
        );
    }

    return(
        <div className="container">
            <div className="row">
                {
                    loginStatus ? userLoggedIn() : handleUserNotLoggedIn()
                }
            </div>
        </div>
    );
}

export default Dashboard;