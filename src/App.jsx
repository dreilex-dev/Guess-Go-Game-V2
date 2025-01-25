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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameLobby from "./componenets/GameLobby";
import HomePage from "./componenets/homePage/HomePage";
import WinnerPage from "./componenets/winnerPage/WinnerPage";
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
          if (lobbyData.gameState === "ready") {
            setGameState("ready");
          }
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser, currentUser?.game_code, setGameState]);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  if (isLoading) return <div className="loading">Loading..</div>;
  return (
    <Router>
        {showLoader && <Loader onLoadingComplete={handleLoadingComplete} />}
          <Routes>
            <Route 
              path="/" 
            element={
              <HomePage 
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
  );
};

export default App;