import React from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import EditTask from "./EditTask";

function UpdateTask({ task, subjects }) {
    let navigate = useNavigate();

    const handleSubmit = (body) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(`http://localhost:3000/update_task/${task.id}`, {
            method: "PATCH",
            body: body,
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
                    title: `${task.title} successfully updated!`,
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

    return (
        <div className="fluid-container">
            <EditTask handleSubmit={handleSubmit} task_presets={task} user_id={task.user_id} subjects={subjects}/>
        </div>
    );
}

export default UpdateTask;