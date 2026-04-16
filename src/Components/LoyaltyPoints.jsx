import React from "react";
import { FaMedal } from "react-icons/fa";

const LoyaltyPoints = ({ points }) => {
  // Define tiers
  const tiers = [
    { name: "Bronze", threshold: 100 },
    { name: "Silver", threshold: 300 },
    { name: "Gold", threshold: 600 },
  ];

  // Find current tier
  const currentTier = tiers.find(t => points < t.threshold) || { name: "Gold", threshold: 600 };

  // Progress percentage
  const progress = Math.min((points / currentTier.threshold) * 100, 100);

  return (
    <div className="loyalty-points">
      <h2>Loyalty Points</h2>
      <p>You have <strong>{points}</strong> points</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>Current Tier: <FaMedal /> {currentTier.name}</p>
    </div>
  );
};

export default LoyaltyPoints;
