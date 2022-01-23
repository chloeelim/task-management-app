import React, { useState } from "react";
import { useNavigate } from "react-router";
import EditSubject from "./EditSubject";

function NewSubject({ userData }) {
    let navigate = useNavigate();
    const subject_presets = {
        title: "",
        description: undefined,
        color: Math.floor(Math.random()*16777215).toString(16),
    }

    const onSubmit = (subject) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        return fetch("http://localhost:3000/new_subject", {
                method: "POST",
                body: JSON.stringify(subject),
                headers: {
                    "X-CSRF-Token": token,
                    "Content-Type": "application/json"
                },
                credentials: "include"
        });
    }

    return (
        <div className="fluid-container">
            <EditSubject subject_presets={subject_presets} subject_events={[]} user_id={userData ? userData.id : userData} onSubmit={onSubmit} request_method="POST" id={null}/>
        </div>
    );
}

export default NewSubject;