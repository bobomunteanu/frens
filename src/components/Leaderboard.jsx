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
              amount,
            })
          );
          leaderboard.sort((a, b) => b.amount - a.amount); // Sort in descending order
          setLeaderboardData(leaderboard.slice(0, 10)); // Get the first 10 accounts
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();

    // Fetch leaderboard data every 20 seconds
    const interval = setInterval(fetchLeaderboardData, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{ position: "absolute", marginTop: "-40vh", marginLeft: "-10vw" }}
    >
      <h1>Leaderboard:</h1>
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
              <td>{index + 1}</td>
              <td>{publicKey}</td>
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
