import React, { useEffect, useState } from "react";
import "./chatList.css";
import { useUserStore } from "../../../lib/userStore";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { toast } from "react-toastify";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();
  const [playersFetched, setPlayersFetched] = useState(false);

  const fetchGameAndUsers = async () => {
    if (!currentUser?.game_code) {
      console.error("Invalid game code for the current user.");
      return [];
    }

    try {
      const gameLobbyRef = doc(db, "gameLobby", currentUser.game_code);
      const gameLobbySnap = await getDoc(gameLobbyRef);

      if (gameLobbySnap.exists()) {
        const participants = gameLobbySnap.data().participants || [];
        if (participants.length > 0) {
          setPlayersFetched(true);
        }
        return participants.filter((user) => user.id !== currentUser.id); // Exclude current user
      } else {
        console.error("Game lobby not found.");
        setPlayersFetched(false);
        return [];
      }
    } catch (error) {
      console.error("Error fetching game lobby:", error);
      setPlayersFetched(false);
      return [];
    }
  };

  const handleToggleAddMode = async () => {
    if (!playersFetched) {
      toast.info("Fetching players, please wait...");
      const players = await fetchGameAndUsers();
      if (players.length > 0) {
        toast.success("Players successfully fetched!");
      } else {
        toast.error("Failed to fetch players. Please try again.");
      }
    }
  };

  const createChatsAndAddUsers = async (filteredUsers) => {
    if (!currentUser || !currentUser.id) {
      console.error("Current user is not defined or not loaded yet.");
      return;
    }

    try {
      for (const user of filteredUsers) {
        if (!user || !user.id) {
          console.error(`User with ID ${user?.id} does not exist.`);
          continue;
        }

        const chatID = [currentUser.id, user.id].sort().join("_");
        const newChatRef = doc(db, "chats", chatID);

        const newChatSnapshot = await getDoc(newChatRef);
        if (!newChatSnapshot.exists()) {
          await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
          });
        }

        const currentUserChatsRef = doc(db, "userChats", currentUser.id);
        const userChatsRef = doc(db, "userChats", user.id);

        const currentUserChatsSnap = await getDoc(currentUserChatsRef);
        const userChatsSnap = await getDoc(userChatsRef);

        if (currentUserChatsSnap.exists() && userChatsSnap.exists()) {
          const existingCurrentUserChats =
            currentUserChatsSnap.data().chats || [];
          const existingUserChats = userChatsSnap.data().chats || [];

          const chatCurrentUserExists = existingCurrentUserChats.some(
            (chat) => chat.id === newChatRef.id
          );
          const chatUserExists = existingUserChats.some(
            (chat) => chat.id === newChatRef.id
          );

          if (!chatCurrentUserExists) {
            await updateDoc(currentUserChatsRef, {
              chats: arrayUnion({
                id: newChatRef.id,
                lastMessage: "",
                receiverId: user.id,
                senderId: currentUser.id,
                updatedAt: Date.now(),
              }),
            });
          }
          if (!chatUserExists) {
            await updateDoc(userChatsRef, {
              chats: arrayUnion({
                id: newChatRef.id,
                lastMessage: "",
                receiverId: currentUser.id,
                senderId: user.id,
                updatedAt: Date.now(),
              }),
            });
          }
        }
      }

      console.log("Chats created and users added!");
    } catch (err) {
      console.error("Error adding users to chat:", err);
      toast.error("Failed to create chats or add users.");
    }
  };

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchChats = async () => {
      const usersInLobby = await fetchGameAndUsers();

      await createChatsAndAddUsers(usersInLobby);

      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.id),
        async (snapshot) => {
          if (snapshot.exists()) {
            const items = snapshot.data().chats || [];

            const enhancedChats = await Promise.all(
              items.map(async (chat) => {
                const userDocRef = doc(db, "users", chat.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                  const user = userDocSnap.data();

                  let displayedAvatar = user.avatar;
                  let displayedUsername = user.username;

                  if (user.is_playing) {
                    const fakeIdentityRef = doc(db, "users", user.is_playing);
                    const fakeIdentitySnap = await getDoc(fakeIdentityRef);

                    if (fakeIdentitySnap.exists()) {
                      const fakeIdentity = fakeIdentitySnap.data();
                      displayedAvatar = fakeIdentity.avatar;
                      displayedUsername = fakeIdentity.username;
                    }
                  }
                  const isInLobby = usersInLobby.some((u) => u.id === user.id);

                  if (isInLobby) {
                    return {
                      ...chat,
                      user,
                      displayedAvatar,
                      displayedUsername,
                    };
                  }
                }
                return null;
              })
            );
            const deduplicatedChats = Array.from(
              new Map(
                enhancedChats.filter(Boolean).map((chat) => [chat.id, chat])
              ).values()
            );

            setChats(
              deduplicatedChats.sort((a, b) => b.updatedAt - a.updatedAt)
            );
          } else {
            console.error("No userChats document found.");
          }
        }
      );
      return () => unsubscribe();
    };
    fetchChats();
  }, [currentUser?.id, currentUser?.game_code]);

  const handleSelect = async (selectedChat) => {
    try {
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id ? { ...chat, isSeen: true } : chat
      );

      const userChatsRef = doc(db, "userChats", currentUser.id);

      await updateDoc(userChatsRef, { chats: updatedChats });
      changeChat(selectedChat.id, selectedChat.user);
      setChats(updatedChats);
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const username = chat?.displayedUsername || "";
    return username.toLowerCase().includes(input.toLowerCase());
  });

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src="./refresh.png"
          alt="refresh"
          className="add"
          onClick={handleToggleAddMode}
        />
      </div>

      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.id}
          onClick={() => handleSelect(chat)}
          style={{
            border: chat?.isSeen
              ? "1px solid transparent"
              : "2px solid #1B9AAA",
            borderRadius: "8px",
            padding: "20px",
            margin: "5px",
          }}
        >
          <img
            src={chat.displayedAvatar || "./avatar.png"}
            alt={chat.displayedUsername}
          />
          <div className="texts">
            <span>{chat.displayedUsername || "Unknown"}</span>
            <p>{chat.lastMessage || ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
