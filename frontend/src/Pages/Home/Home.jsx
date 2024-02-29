import React from "react";

function Home({ handleLogout }) {
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
