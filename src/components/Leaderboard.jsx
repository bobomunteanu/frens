import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardResponse = await axios.get(
          "https://corsproxy.io/?https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users.json"
        );

        if (leaderboardResponse.data) {
          const leaderboard = Object.entries(leaderboardResponse.data).map(
            ([publicKey, { amount }]) => ({
              publicKey,
              amount: amount - 1,
            })
          );
          leaderboard.sort((a, b) => b.amount - a.amount); // Sort in descending order
          setLeaderboardData(leaderboard.slice(0, 20)); // Get the first 10 accounts
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();

    // Fetch leaderboard data every 5 seconds
    const interval = setInterval(fetchLeaderboardData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>$FRENS</h1>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Public Key</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(({ publicKey, amount }, index) => (
            <tr key={publicKey}>
              <td>#{index + 1}</td>
              <td>
                {publicKey.slice(0, 4)}. . .{publicKey.slice(-4)}
              </td>
              <td style={{ color: "darkorange" }}>
                {amount}
                <img
                  src="https://raw.githubusercontent.com/bobomunteanu/frens/main/src/assets/tkfrens.png"
                  width={"20vh"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
