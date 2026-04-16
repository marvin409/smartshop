import React, { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const getActivityIcon = (action) => {
  const text = action.toLowerCase();
  if (text.includes("product")) return "PR";
  if (text.includes("order")) return "OR";
  if (text.includes("payment")) return "PM";
  return "AC";
};

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get(buildApiUrl("/api/activity_log"))
      .then((res) => setActivities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setActivities([]));
  }, []);

  return (
    <div className="dashboard">
      <h1>Full Activity Log</h1>
      {activities.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <div className="recent-activity">
          <div className="timeline">
            {activities.map((item, index) => (
              <div key={`${item.action}-${index}`} className="timeline-item">
                <div className="timeline-dot">{getActivityIcon(item.action)}</div>
                <div className="timeline-content">
                  <p>{item.action}</p>
                  <span className="timeline-time">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
