export const calculateRanks = (players) => {
    const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));
  
    const ranks = [];
    let currentRank = 1;
  
    for (let i = 0; i < sortedPlayers.length; i++) {
      if (i > 0 && sortedPlayers[i].points === sortedPlayers[i - 1].points) {
        ranks.push(currentRank);
      } else {
        currentRank = i + 1;
        ranks.push(currentRank);
      }
    }
  
    return sortedPlayers.map((player, index) => ({
      ...player,
      rank: ranks[index],
    }));
  };
  