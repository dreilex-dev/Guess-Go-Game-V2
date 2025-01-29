
//option with ranking according the how fast the user respond
// Option: Ranking based on speed of response
export const calculateRanks = (players) => {
  // Step 1: Sort players by:
  // - Points in descending order (higher points first)
  // - If points are equal, sort by `lastGuessTakenTime` in ascending order (earlier response first)
  const sortedPlayers = [...players].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) {
      return (b.points || 0) - (a.points || 0); // Higher points first
    }
    return (a.lastGuessTakenTime || Infinity) - (b.lastGuessTakenTime || Infinity); // Faster response first
  });

  // Step 2: Assign ranks only to the top 3 players
  return sortedPlayers.map((player, index) => ({
    ...player,
    rank: index < 3 ? index + 1 : null, // Assign rank 1, 2, 3 to the top 3 players
  }));
};

