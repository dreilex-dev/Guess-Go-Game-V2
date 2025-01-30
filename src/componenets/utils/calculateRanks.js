export const calculateRanks = (players) => {
  // Step 1: Sort players by points and response time
  const sortedPlayers = [...players].map(player => {
    const totalHints = player.initialHints || 3; // Set default to 3 hints if not present
    const hintsUsed = totalHints - (player.no_of_hints || 0);

    let bonusPoints = 0;
    if (hintsUsed === 0) {
      bonusPoints = 1; // If no hints were used, add 2 points
    } else if (hintsUsed <= totalHints / 2) {
      bonusPoints = 0.5; // If half or less hints were used, add 1 point
    }

    return {
      ...player,
      adjustedPoints: (player.points || 0) + bonusPoints, // Include bonus points in ranking
    };
  });

  // Step 2: Sort players by adjusted points and lastGuessTakenTime
  sortedPlayers.sort((a, b) => {
    if (b.adjustedPoints !== a.adjustedPoints) {
      return b.adjustedPoints - a.adjustedPoints; // Higher adjusted points first
    }
    return (a.lastGuessTakenTime || Infinity) - (b.lastGuessTakenTime || Infinity); // Faster response first
  });

  // Step 3: Assign ranks only to the top 3 players
  return sortedPlayers.map((player, index) => ({
    ...player,
    rank: index < 3 ? index + 1 : null, // Assign rank 1, 2, 3 to the top 3 players
  }));
};
