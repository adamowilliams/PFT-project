import React from 'react';



function Home({ username }) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>What app will you use today?</p>
    </div>
  );
}

export default Home;