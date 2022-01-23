import React from "react";
import { Link } from 'react-router-dom'

export default () => (
    <div className="vw-100 vh-100 d-flex align-items-center justify-content-center">
        <h1>Hmmm, looks like you're lost...</h1>
        <Link to='/'>Bring me home</Link>
    </div>
);