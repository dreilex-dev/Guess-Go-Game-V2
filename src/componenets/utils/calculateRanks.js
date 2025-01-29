export const calculateRanks = (players) => {
  // Step 1: Sort players by their points in descending order
  // - Higher points come first
  // - If a player has no points, we assume it's 0 (using `|| 0`)
  const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

  // Step 2: Initialize ranking variables
  let rank = 1; // This holds the current rank (starting from 1)
  let previousPoints = null; // Keeps track of the last seen points for comparison
  let skipRank = 0; // Keeps track of how many players have the same rank (tie handling)

  // Step 3: Assign ranks to players
  const rankedPlayers = sortedPlayers.map((player, index) => {
    if (player.points !== previousPoints) {
      // If the current player's points are different from the previous player:
      // - Update the rank (adjusting for any skipped ranks due to ties)
      rank = index + 1 - skipRank; // Example: If 2 players tied for rank 1, next rank should be 3
    } else {
      // If the current player's points are the same as the previous player:
      // - Increase the `skipRank` counter (this helps adjust ranking for ties)
      skipRank++;
    }

    // Update `previousPoints` to the current player's points for the next iteration
    previousPoints = player.points;

    // Return the updated player object with the assigned rank
    return {
      ...player,
      rank,
    };
  });

  return rankedPlayers;
};
