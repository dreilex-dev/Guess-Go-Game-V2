import React, { useEffect, useState } from "react";
import { useUserStore } from "../../lib/userStore";
import GameCode from "./GameCode";
import PlayerCard from "./PlayerCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import LeaveButton from "./LeaveButton";
import ChatButton from "./ChatButton";
import { useNavigate } from 'react-router-dom';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Lobby = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const currentUser = useUserStore((state) => state.currentUser);
  const lobbyCode = currentUser?.game_code || "No Lobby Code";

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
              fetchedPlayers.push(playerSnap.data());
            }
          }

          setPlayers(fetchedPlayers);
        } else {
          console.error("Lobby does not exist!");
        }
      } catch (error) {
        console.error("Error fetching lobby players:", error);
      }
    };

    fetchPlayersFromLobby();
  }, [lobbyCode]);

  const handleChat = (player) => {
    navigate('/chat_room');
  };

  const handleReveal = (player) => {
    console.log(`Revealing information for player ID: ${player.id}`);
  };

  const handleLeave = () => {
    console.log("Leave button clicked!");
  };

  const handleChatClick = () => {
    navigate('/chat_room');
  };

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <div className="lobby-code-container">
          <GameCode gameCode={lobbyCode} />
        </div>
        <div className="leave-button-container">
          <LeaveButton onLeave={handleLeave} />
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
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1440: {
              slidesPerView: 4,
              spaceBetween: 30,
            }
          }}
          className="players-swiper"
        >
          {players.map((player) => (
            <SwiperSlide key={player.id}>
              <PlayerCard
                avatar={player.avatar}
                name={player.name}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="chat-button-container">
        <ChatButton onChatClick={handleChatClick} />
      </div>
    </div>
  );
};

export default Lobby;
