import React, { useEffect, useState } from "react";
import axios from "axios";

const NFTLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardResponse = await axios.get(
          "https://corsproxy.io/?https://burnfrens-default-rtdb.europe-west1.firebasedatabase.app/users.json"
        );

        if (leaderboardResponse.data) {
          const leaderboard = Object.entries(leaderboardResponse.data).map(
            ([publicKey, { nfts }]) => ({
              publicKey,
              nfts: nfts - 1,
            })
          );
          leaderboard.sort((a, b) => b.nfts - a.nfts); // Sort in descending order
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
    <div style={{ position: "relative" }}>
      <h1>NFT Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Public Key</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(({ publicKey, nfts }, index) => (
            <tr key={publicKey}>
              <td>#{index + 1}</td>
              <td>{publicKey}</td>
              <td style={{ color: "darkorange" }}>
                {nfts}
                <img src="../../src/assets/zgfrens.png" width={"20vh"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFTLeaderboard;
