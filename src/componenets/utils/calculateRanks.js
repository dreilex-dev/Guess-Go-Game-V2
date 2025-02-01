export const calculateRanks = (players) => {
  console.log("Initial players data:", players);

  const updatedPlayers = players.map(player => ({
    ...player,
    hintsUsed: (player.initialHints || 0) - (player.no_of_hints || 0),
  }));

  console.log("Players after calculating hints used:", updatedPlayers);

  const sortedPlayers = [...updatedPlayers].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) {
      console.log(`Sorting by points: ${b.username} (${b.points}) vs ${a.username} (${a.points})`);
      return (b.points || 0) - (a.points || 0);
    }
    
    const aHintPenalty = (a.hintsUsed || 0) * 30000; 
    const bHintPenalty = (b.hintsUsed || 0) * 30000;

    console.log(`Hint penalties: ${a.username} (${aHintPenalty}) vs ${b.username} (${bHintPenalty})`);
    console.log(`Comparing last guess time: ${a.lastGuessTakenTime + aHintPenalty} vs ${b.lastGuessTakenTime + bHintPenalty}`);
    
    return (a.lastGuessTakenTime + aHintPenalty) - (b.lastGuessTakenTime + bHintPenalty);
  });

  console.log("Sorted players by rank:", sortedPlayers);

  const rankedPlayers = sortedPlayers.map((player, index) => ({
    ...player,
    rank: index < 3 ? index + 1 : null,
    initialHints: player.initialHints || 0,
    hintsUsed: player.hintsUsed || 0,
  }));

  console.log("Final ranked players:", rankedPlayers);

  return rankedPlayers;
};
