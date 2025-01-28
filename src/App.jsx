import Details from "./componenets/details/Details";
import List from "./componenets/list/List";
import Chat from "./componenets/chat/Chat";
import Login from "./componenets/login/Login";
import Notification from "./componenets/notification/Notification";
import { useEffect, useState } from "react";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import AddUser from "./componenets/list/chatList/addUser/AddUser";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import GameLobby from "./componenets/GameLobby";
import React from "react";
import Home from "./componenets/home/Home";
import { ScoreProvider } from './context/ScoreContext';
import Loader from "./componenets/loader/Loader";

const App = () => {
  const {
    currentUser,
    isLoading,
    fetchUserInfo,
    incrementPoints,
    decrementHints,
    setIsPlaying,
    allPlayers,
    gameState,
    setGameState,
  } = useUserStore();

  const { chatId } = useChatStore();
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timerDuration, setTimerDuration] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [showRedBorder, setShowRedBorder] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      fetchUserInfo(currentUser?.id);
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    if (currentUser && currentUser.game_code) {
      const gameLobbyDocRef = doc(db, "gameLobby", currentUser.game_code);
      const unsubscribe = onSnapshot(gameLobbyDocRef, (gameLobbyDoc) => {
        if (gameLobbyDoc.exists()) {
          const lobbyData = gameLobbyDoc.data();

          if (lobbyData.timerDuration && lobbyData.timerStart) {
            setTimerDuration(lobbyData.timerDuration);
            setTimerStart(lobbyData.timerStart);
          }

          if (lobbyData.gameState === "ready") {
            setGameState("ready");
          }
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser, currentUser?.game_code, setGameState]);
  console.log(currentUser?.username);
  console.log(currentUser?.game_code);
  console.log(gameState);

  useEffect(() => {
    if (timerDuration && timerStart) {
      const updateTimer = () => {
        const elapsedTime = Math.floor((Date.now() - timerStart) / 1000);
        const timeLeft = Math.max(0, timerDuration - elapsedTime);

        if (timeLeft <= 60) {
          setShowRedBorder(true);
        } else {
          setShowRedBorder(false);
        }
        if (timeLeft === 0) {
          setIsTimeUp(true);
          setShowRedBorder(false);
          clearInterval(interval);
        }
      };

      const interval = setInterval(updateTimer, 1000);
      updateTimer();

      return () => clearInterval(interval);
    }
  }, [timerDuration, timerStart]);

  console.log(gameState);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  if (isLoading) return <div className="loading">Loading..</div>;
  
  return (
    <ScoreProvider>
      <Router>
        {showLoader && <Loader onLoadingComplete={handleLoadingComplete} />}
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  showLoader={showLoader} 
                  setShowLoader={setShowLoader} 
                />
              } 
            />
            {!currentUser && (
              <Route 
                path="/game/*" 
                element={<Login setShowLoader={setShowLoader} />} 
              />
            )}
            {currentUser && gameState !== "ready" && (
              <Route 
                path="/game/*" 
                element={<AddUser setShowLoader={setShowLoader} />} 
              />
            )}
            {currentUser && gameState === "ready" && (
              <>
                <Route 
                  path="/game" 
                  element={<GameLobby setShowLoader={setShowLoader} />} 
                />
                <Route
                  path="/chat_room"
                  element={
                    <>
                      <List setShowLoader={setShowLoader} />
                      {chatId && (
                        <>
                          <Chat />
                          <Details />
                        </>
                      )}
                    </>
                  }
                />
              </>
            )}
          </Routes>
        <Notification />
      </Router>
    </ScoreProvider>
  );
};

export default App;
