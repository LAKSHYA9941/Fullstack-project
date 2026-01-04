import React from 'react';
import './App.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="glass-card dashboard-card animate-fade-in">
        <div className="dashboard-header">
          <h1>Welcome, {user.fullname || 'Explorer'}!</h1>
          <p>You've successfully logged into your premium dashboard.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item glass-card">
            <h3>Profile</h3>
            <p>@{user.username || 'username'}</p>
          </div>
          <div className="stat-item glass-card">
            <h3>Email</h3>
            <p>{user.email || 'email@example.com'}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-primary" style={{ marginTop: '2rem', background: '#ef4444' }}>
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .dashboard-container {
          width: 100%;
          max-width: 800px;
          padding: 20px;
        }
        .dashboard-card {
          padding: 3rem;
          border-radius: 32px;
          text-align: center;
        }
        .dashboard-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .stat-item {
          padding: 1.5rem;
          border-radius: 20px;
          animation: none; /* Disable floating for sub-cards */
        }
        .stat-item h3 {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .stat-item p {
          font-size: 1.1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
