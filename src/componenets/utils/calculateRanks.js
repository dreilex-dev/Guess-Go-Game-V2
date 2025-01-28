export const calculateRanks = (players) => {
  // Sort players by points
  const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

  // Apply correct ranks
  let rank = 1; // Current rank
  let previousPoints = null; // Last seen points
  let skipRank = 0; // Skip for next rank

  const rankedPlayers = sortedPlayers.map((player, index) => {
    if (player.points !== previousPoints) {
      // Update rank only if current points differ from previous
      rank = index + 1 - skipRank; // Adjust rank for previous skips
    } else {
      // If points are the same, skip rank increment
      skipRank++;
    }

    previousPoints = player.points;

    return {
      ...player,
      rank,
    };
  });

  return rankedPlayers;
};
