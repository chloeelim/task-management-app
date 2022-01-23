import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";
import Task from "./Task";
import SubjectOverview from "./SubjectOverview";
import Subject from "./Subject";
import Event from "./Event";
import TaskOverview from "./TaskOverview";
import NavBar from './Navbar';
import Swal from 'sweetalert2';

function App() {
    // const [loginStatus, setLoginStatus] = useState();
    const [user, setUser] = useState({});
    const [loginStatus, setLoginStatus] = useState();
    useEffect(() => handleLoginStatus(), []);

    function handleLoginStatus() {
        fetch("http://localhost:3000/logged_in", {
            method: "GET",
            // allows Rails to set cookie
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.logged_in) {
                // user is logged in, trigger login event
                setLoginStatus(true);
                setUser(response.user);
            } else {
                setLoginStatus(false);
                setUser({});
            }
        })
        .catch(error => console.log('An error occurred', error));
    }

    function handleLogin(userData) {
        setUser(userData);
        setLoginStatus(true);
    }

    function handleLogout() {
        setUser({});
        setLoginStatus(false);
        let timerInterval;
        Swal.fire({
            icon: "success",
            title: "Logging you out, goodbye!",
            timer: 2000,
            showCloseButton: true,
            willClose: () => {
                clearInterval(timerInterval);
                window.location.reload();
            }
        });
    }

    return (
        <Router>
            <NavBar loginStatus={loginStatus} handleLogout={handleLogout} handleSubmit={handleLogin}/>
            <Routes>
                <Route path='/' exact element={<Welcome handleLogout={handleLogout} user={user} loginStatus={loginStatus}/>}/>
                <Route path='/login' exact element={<Login handleSubmit={handleLogin} loginStatus={loginStatus}/>}/>
                <Route path='/signup' exact element={<Signup handleSubmit={handleLogin}/>}/>
                <Route path='/dashboard' exact element={<Dashboard loginStatus={loginStatus} user={user}/>}/>
                <Route path='/tasks' exact element={<TaskOverview />}/>
                <Route path='/tasks/:task_id' exact element={<Task />}/>
                <Route path='/subjects' exact element={<SubjectOverview />}/>
                <Route path='/subjects/:subject_id' exact element={<Subject/>}/>
                <Route path='/events/:event_id' exact element={<Event/>}/>
                <Route path='/*' exact element={<NotFound/>}/>
            </Routes>
        </Router>
    );

}

export default App;