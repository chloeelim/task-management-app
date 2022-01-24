import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import EditTask from "./EditTask";

function NewTask({ userData, subjects }) {
    let navigate = useNavigate();
    const task_presets = {
        title: "",
        description: undefined,
        deadline: null,
        subject_id: null,
        priority: "none",
        completed: false
    }

    const handleSubmit = (body) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch("/new_task", {
            method: "POST",
            body: body,
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        .then(response => response.json())
        .then(response => {
            if(response.task_created) {
                let timerInterval;
                Swal.fire({
                    icon: "success",
                    title: `Task successfully created!`,
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
                        navigate("/dashboard");
                        window.location.reload();
                    }
                });
            }
        })
        .catch(error => console.log("An error occured", error));
    }

    return (
        <div className="fluid-container">
            <EditTask handleSubmit={handleSubmit} task_presets={task_presets} user_id={userData ? userData.id : userData} subjects={subjects}/>
        </div>
    );
}

export default NewTask;