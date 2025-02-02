export const calculateRanks = (players) => {
  const updatedPlayers = players.map((player) => ({
    ...player,
    hintsUsed: (player.initialHints || 0) - (player.no_of_hints || 0),
  }));

  const sortedPlayers = [...updatedPlayers].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) {
      return (b.points || 0) - (a.points || 0);
    }

    const aHintPenalty = (a.hintsUsed || 0) * 30000;
    const bHintPenalty = (b.hintsUsed || 0) * 30000;

    return (
      a.lastGuessTakenTime +
      aHintPenalty -
      (b.lastGuessTakenTime + bHintPenalty)
    );
  });

  const rankedPlayers = sortedPlayers.map((player, index) => ({
    ...player,
    rank: index < 3 ? index + 1 : null,
    initialHints: player.initialHints || 0,
    hintsUsed: player.hintsUsed || 0,
  }));

  console.log("Final ranked players:", rankedPlayers);

  return rankedPlayers;
};
