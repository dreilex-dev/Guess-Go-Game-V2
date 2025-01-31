import React, { useEffect, useState } from "react";
import { useUserStore } from "../../lib/userStore";
import PlayerCard from "./PlayerCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import LeaveButton from "./LeaveButton";
import ChatButton from "./ChatButton";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Timer from "./Timer";
import RevealedPlayerCard from "./RevealedPlayerCard";

import { calculateRanks } from "../utils/calculateRanks";

import LogOutButton from "../LogOutButton";


const Lobby = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const currentUser = useUserStore((state) => state.currentUser);
  const lobbyCode = currentUser?.game_code || "No Lobby Code";
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchPlayersFromLobby = async () => {
      try {
        const lobbyRef = doc(db, "gameLobby", lobbyCode);
        const lobbySnap = await getDoc(lobbyRef);
        if (lobbySnap.exists()) {
          const lobbyData = lobbySnap.data();
          const participantIds = lobbyData.participants.map(
            (participant) => participant.id
          );

          const fetchedPlayers = [];
          for (const playerId of participantIds) {
            const playerRef = doc(db, "users", playerId);
            const playerSnap = await getDoc(playerRef);
            if (playerSnap.exists()) {
              const playerData = playerSnap.data();
              if (playerData.is_playing) {
                const playingUserRef = doc(db, "users", playerData.is_playing);
                const playingUserSnap = await getDoc(playingUserRef);
                if (playingUserSnap.exists()) {
                  const playingUserData = playingUserSnap.data();
                  fetchedPlayers.push({
                    ...playerData,
                    playingAs: playingUserData.username,
                  });
                }
              }
            }
          }

          setPlayers(fetchedPlayers);
        } else {
          console.error("Lobby does not exist!");
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayersFromLobby();
  }, [lobbyCode]);

  useEffect(() => {
    const handleTimeUp = () => {
      setIsTimeUp(true);
    };

    window.addEventListener("showRealNames", handleTimeUp);
    return () => window.removeEventListener("showRealNames", handleTimeUp);
  }, []);

  const handleChatClick = () => {
    navigate("/chat_room");
  };

  const handleLeave = () => {
    console.log("Leave button clicked!");
  };

  // calculate ranks
const playersWithRanks = players.length > 0 ? calculateRanks(players) : [];

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <div className="lobby-code-container">
          <Timer players={players} />
        </div>

        <div className="leave-button-container">
          {isTimeUp ? (
            <button
              className="leave-button"
              onClick={() => {
                const resetUser = useUserStore.getState().resetUser;
                resetUser();
              }}
            >
              Play Again
            </button>
          ) : (
            <LogOutButton/>
          )}
        </div>
      </div>

      <div className="players-swiper-outer">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            481: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            769: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="players-swiper"
        >
          {playersWithRanks.map((player) => (
            <div>
            <SwiperSlide key={player.id}>
              {isTimeUp ? (
                <RevealedPlayerCard player={player} rank={player.rank} />
              ) : (
                <PlayerCard player={player} />
              )}
            </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>

      {!isTimeUp && (
        <div className="chat-button-container">
          <ChatButton onChatClick={handleChatClick} />
        </div>
      )}
    </div>
  );
};

export default Lobby;
