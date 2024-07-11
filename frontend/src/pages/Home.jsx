import React, { useState, useEffect } from 'react';
import api from "../api";

function Home () {
    const [username, setUsername] = useState("");

    useEffect(() => {
        getUsername();
    }, []);

    const getUsername = async () => {
        try {
            const res = await api.get("/api/current-user/");
            setUsername(res.data.username);
        } catch (err) {
            console.error('Failed to fetch username:', err);
            setError(err.response ? err.response.data : "An error occurred");
        }
    };

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>What app will you use today?</p>
        </div>
    );
}

export default Home;