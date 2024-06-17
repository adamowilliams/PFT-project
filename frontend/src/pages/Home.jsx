import React from 'react';
import { useState, useEffect } from 'react';
import api from "../api";

function Home () {
    const [username, setUsername] = useState("");

    useEffect(() => {
        getUsername();
    }, []);

    const getUsername = () => {
        api
            .get("/api/current-user/")
            .then((res) => setUsername(res.data.username))
            .catch((err) => alert('Failed to fetch username:',err));
    }

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>What app will you use today?</p>
        </div>
    );
}

export default Home;