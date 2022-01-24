import React, { useState } from "react";
import { useNavigate } from "react-router";
import EditSubject from "./EditSubject";

function UpdateSubject({ user_id, subject_presets, subject_events }) {
    const onSubmit = (subject) => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        return fetch("/new_subject", {
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
            <EditSubject subject_presets={subject_presets} subject_events={subject_events} user_id={user_id} onSubmit={onSubmit} request_method="PATCH"/>
        </div>
    );
}

export default UpdateSubject;