export const calculateRanks = (players) => {
  // check if all players have 0 points
  const allZeroPoints = players.every((player) => (player.points || 0) === 0);

  if (allZeroPoints) {
    return players.map((player) => ({
      ...player,
      rank: null, 
    }));
  }
  // sort players by points
  const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

  let currentRank = 1;
  let previousPoints = null;
  // calculate ranks
  return sortedPlayers.map((player, index) => {
    if (player.points !== previousPoints) {
      currentRank = index + 1;
    }

    previousPoints = player.points;

    return {
      ...player,
      rank: currentRank,
    };
  });
};
