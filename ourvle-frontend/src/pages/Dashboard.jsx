import React from "react";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  return (
    <div className="container mt-5">
      <h3>Dashboard</h3>
      {payload ? (
        <div className="card p-3">
          <p><strong>User ID:</strong> {payload.sub}</p>
          <p><strong>Role:</strong> {payload.role}</p>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Dashboard;
