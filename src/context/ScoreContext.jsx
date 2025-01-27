import React, { createContext, useState, useContext } from 'react';

// Creăm contextul pentru scoruri
const ScoreContext = createContext();

// Provider pentru scoruri
export const ScoreProvider = ({ children }) => {
  // Inițializăm scorurile cu un obiect gol
  const [scores, setScores] = useState({});

  // Funcție pentru a inițializa scorurile la începutul jocului
  const initializeScores = (players) => {
    const initialScores = {};
    players.forEach(player => {
      initialScores[player.id] = 100; // Punctaj de bază
    });
    setScores(initialScores);
  };

  return (
    <ScoreContext.Provider value={{ scores, setScores, initializeScores }}>
      {children}
    </ScoreContext.Provider>
  );
};

// Hook pentru a folosi contextul scorurilor
export const useScores = () => useContext(ScoreContext);
