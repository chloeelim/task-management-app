import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "../components/Welcome";
import Signup from "../components/Signup";
import Login from "../components/Login";

class Index extends React.Component {
    render() {
        return(
            <Router>
                <Routes>
                    <Route path="/" exact element={<Welcome />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/signup" exact element={<Signup />} />
                </Routes>
            </Router>
        );
    }
}

export default Index.render;