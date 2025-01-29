import Details from "./componenets/details/Details";
import List from "./componenets/list/List";
import Chat from "./componenets/chat/Chat";
import Login from "./componenets/login/Login";
import Notification from "./componenets/notification/Notification";
import { useEffect,useState } from "react";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import AddUser from "./componenets/list/chatList/addUser/AddUser";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import { BrowserRouter as Router, Route, Routes ,Navigate  } from "react-router-dom";
import GameLobby from "./componenets/GameLobby";
import React from "react";

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

  useEffect(() => {
    if (timerDuration && timerStart) {
      const updateTimer = () => {
        const elapsedTime = Math.floor((Date.now() - timerStart) / 1000); 
        const timeLeft = Math.max(0, timerDuration - elapsedTime); 
  
        if (timeLeft === 0) {
          setIsTimeUp(true);
          clearInterval(interval); 
        }
      };
  
      const interval = setInterval(updateTimer, 1000);
      updateTimer(); 
  
      return () => clearInterval(interval); 
    }
  }, [timerDuration, timerStart]);

  if (isLoading) return <div className="loading">Loading..</div>;
  return (

      <Router>
        <div className="container">
          <Routes>
            {!currentUser && <Route path="*" element={<Login />} />}
            {currentUser && gameState !== "ready" && (
              <Route path="*" element={<AddUser />} />
            )}
            {currentUser && gameState === "ready" && (
              <>
                <Route path="/" element={<GameLobby />} />{" "}
                <Route
                  path="/chat_room"
                  element={
                    isTimeUp ? ( 
                      <Navigate to="/" replace />
                    ) : (
                      <>
                        <List />
                        {chatId && (
                          <>
                            <Chat />
                            <Details />
                          </>
                        )}
                      </>
                    )
                  }
                />
              </>
            )}
          </Routes>
        </div>
        <Notification />
      </Router>

  );
};

export default App;