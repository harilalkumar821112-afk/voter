import React, { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${user._id}`);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const downloadReceipt = (notification) => {
    if (!notification?.receipt) return;

    const receipt = notification.receipt;
    const content = `Vote Receipt\n\nReceipt Number: ${receipt.receiptNumber}\nVoter ID: ${receipt.voterId || "N/A"}\nCandidate: ${receipt.candidateName}\nParty: ${receipt.candidateParty}\nDate: ${new Date(receipt.voteDate).toLocaleString()}\n\nThank you for voting.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${receipt.receiptNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4 text-center">Notifications</h2>

      {loading && <p className="text-center">Loading notifications...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && notifications.length === 0 && (
        <div className="alert alert-info text-center">No notifications yet. Your receipt will appear here after voting.</div>
      )}

      <div className="row g-4">
        {notifications.map((notification) => (
          <div className="col-lg-6 col-12" key={notification._id}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{notification.title}</h5>
                <p className="card-text flex-grow-1">{notification.message}</p>
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </p>

                {notification.receipt && (
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => downloadReceipt(notification)}
                  >
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
