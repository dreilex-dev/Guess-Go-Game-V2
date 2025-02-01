export const calculateRanks = (players) => {
  console.log("=== Starting Rank Calculations ===");
  
  // Step 1: Calculate time penalties for hints
  const sortedPlayers = [...players].map(player => {
    const hintsUsed = 2 - (player.no_of_hints || 0);
    const HINT_PENALTY = 30000; // 30 seconds in milliseconds
    const timeWithPenalty = (player.lastGuessTakenTime || 0) + (hintsUsed * HINT_PENALTY);

    // console.log(`\nPlayer ${player.username || player.id}:`);
    // console.log(`- Original time: ${player.lastGuessTakenTime ? new Date(player.lastGuessTakenTime).toISOString() : 'No time'}`);
    // console.log(`- Hints used: ${hintsUsed} (${hintsUsed * 30}s penalty)`);
    // console.log(`- Final time with penalty: ${new Date(timeWithPenalty).toISOString()}`);
    // console.log(`- Points: ${player.points || 0}`);

    return {
      ...player,
      adjustedTime: timeWithPenalty,
      adjustedPoints: player.points || 0
    };
  });

  // Step 2: Sort players by points first, then by adjusted time
  sortedPlayers.sort((a, b) => {
    if (b.adjustedPoints !== a.adjustedPoints) {
      return b.adjustedPoints - a.adjustedPoints;
    }
    return a.adjustedTime - b.adjustedTime;
  });

  // Step 3: Assign ranks and log final results
  // console.log("\n=== Final Rankings ===");
  const rankedPlayers = sortedPlayers.map((player, index) => {
    const rank = index < 3 ? index + 1 : null;
    console.log(`${rank || 'No rank'}: ${player.username || player.id}`);
    console.log(`   Points: ${player.adjustedPoints}`);
    console.log(`   Final Time: ${new Date(player.adjustedTime).toISOString()}`);
    return {
      ...player,
      rank
    };
  });

  // console.log("=== Calculation Complete ===\n");
  return rankedPlayers;
};

export default calculateRanks;