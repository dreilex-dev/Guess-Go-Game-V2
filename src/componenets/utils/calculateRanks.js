//1 option - have multiple players on the rank 1
// export const calculateRanks = (players) => {
//   // Step 1: Sort players by their points in descending order
//   // - Higher points come first
//   // - If a player has no points, we assume it's 0 (using `|| 0`)
//   const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

//   // Step 2: Initialize ranking variables
//   let rank = 1; // This holds the current rank (starting from 1)
//   let previousPoints = null; // Keeps track of the last seen points for comparison
//   let skipRank = 0; // Keeps track of how many players have the same rank (tie handling)

//   // Step 3: Assign ranks to players
//   const rankedPlayers = sortedPlayers.map((player, index) => {
//     if (player.points !== previousPoints) {
//       // If the current player's points are different from the previous player:
//       // - Update the rank (adjusting for any skipped ranks due to ties)
//       rank = index + 1 - skipRank; // Example: If 2 players tied for rank 1, next rank should be 3
//     } else {
//       // If the current player's points are the same as the previous player:
//       // - Increase the `skipRank` counter (this helps adjust ranking for ties)
//       skipRank++;
//     }

//     // Update `previousPoints` to the current player's points for the next iteration
//     previousPoints = player.points;

//     // Return the updated player object with the assigned rank
//     return {
//       ...player,
//       rank,
//     };
//   });

//   return rankedPlayers;
// };


/*
//option to have multiple players on 2nd and 3rd rank 
export const calculateRanks = (players) => {
  // Step 1: Sort players by points in descending order
  // - Players with higher points are ranked first
  // - If a player has no points, we assume it's 0 (using `|| 0`)
  const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

  // Step 2: Initialize ranking variables
  let rank = 1; // Keeps track of the current rank (starting from 1)
  let previousPoints = null; // Stores the last seen points to compare with the next player

  // Step 3: Assign ranks to players
  const rankedPlayers = sortedPlayers.map((player, index) => {
    // If the player's points are different from the previous player's points:
    if (player.points !== previousPoints) {
      // Assign a new rank based on the player's index position in the sorted array
      rank = index + 1;
    }

    // Update `previousPoints` to store the current player's points
    previousPoints = player.points;

    // Return the updated player object with the assigned rank
    return {
      ...player,
      rank, // The assigned rank is now correct based on the sorting order
    };
  });

  return rankedPlayers; // Return the new array of players with ranks
};

*/


//option with ranking according the how fast the user respond
export const calculateRanks = (players) => {
  // Step 1: Sort players by:
  // - Points in descending order (higher points first)
  // - If points are equal, sort by response time in ascending order (faster response first)
  const sortedPlayers = [...players].sort((a, b) => {
    if ((b.points || 0) !== (a.points || 0)) {
      return (b.points || 0) - (a.points || 0); // Higher points first
    }
    console.log(a.responseTime);
    console.log(b.responseTime);
    return (a.responseTime || Infinity) - (b.responseTime || Infinity); // Faster response first
  });


  // Step 2: Assign ranks to only the top 3 players
  const rankedPlayers = sortedPlayers.map((player, index) => {
    let rank = null; // Default rank is null (no rank assigned)
    
    if (index === 0) rank = 1; // First place
    if (index === 1) rank = 2; // Second place
    if (index === 2) rank = 3; // Third place

    return {
      ...player,
      rank, // Assign rank only if they are in the top 3
    };
  });

  return rankedPlayers;
};
