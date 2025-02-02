import React, { useState, useEffect } from "react";
import "./login.css";
import { avatars } from "../../../public/avatars";
import { signInAnonymously } from "firebase/auth";
import { db } from "../../lib/firebase";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { useUserStore } from "../../lib/userStore";

const Login = () => {
  const [avatarJoin, setAvatarJoin] = useState(null);
  const [gameCode, setGameCode] = useState("");
  const [usernameJoin, setUsernameJoin] = useState("");
  const [hintNo1Join, setHintNo1Join] = useState("");
  const [hintNo2Join, setHintNo2Join] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);

  const [avatarCreate, setAvatarCreate] = useState(null);
  const [usernameCreate, setUsernameCreate] = useState("");
  const [hintNo1Create, setHintNo1Create] = useState("");
  const [hintNo2Create, setHintNo2Create] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);

  const resetUser = useUserStore((state) => state.resetUser);
  const { setGameState } = useUserStore();

  const getRandomAvatar = async (gameCode) => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("game_code", "==", gameCode)
      );
      const userSnap = await getDocs(usersQuery);

      const usedAvatarsInGame = userSnap.docs.map((doc) => doc.data().avatar);

      const availableAvatars = avatars.filter(
        (avatar) => !usedAvatarsInGame.includes(avatar)
      );

      if (availableAvatars.length === 0) {
        toast.warn("All avatars are used. Reassigning from existing avatars.");
        return avatars[Math.floor(Math.random() * avatars.length)];
      }

      return availableAvatars[
        Math.floor(Math.random() * availableAvatars.length)
      ];
    } catch (error) {
      console.error("Error fetching used avatars:", error);
      toast.error("Failed to fetch available avatars.");
      return null;
    }
  };

  const handleAvatarJoin = () => {
    console.log(avatars);
    const selectedAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    if (selectedAvatar) {
      setAvatarJoin(selectedAvatar);
    }
  };

  const handleAvatarCreate = () => {
    const selectedAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    if (selectedAvatar) {
      setAvatarCreate(selectedAvatar);
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    await resetUser();
    setGameState("notReady");
    setLoadingJoin(true);
    const formData = new FormData(e.target);
    const { username_join, game_code, hint_no1_join, hint_no2_join } =
      Object.fromEntries(formData);

    if (!username_join || !game_code || !hint_no1_join || !hint_no2_join) {
      toast.error("Please fill in all the fields.");
      setLoadingJoin(false);
      return;
    }

    try {
      const gameLobbyRef = doc(db, "gameLobby", game_code);
      const gameLobbySnap = await getDoc(gameLobbyRef);

      const gameLobbyData = gameLobbySnap.data();

      if (!gameLobbySnap.exists()) {
        toast.error("Invalid game code. Please try again.");
        setLoadingJoin(false);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      const selectedAvatar = await getRandomAvatar(game_code);
      if (!selectedAvatar) {
        toast.error("Failed to assign a unique avatar.");
        return;
      }
      setAvatarJoin(selectedAvatar);

      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username_join),
        where("game_code", "==", game_code)
      );

      const userSnap = await getDocs(userQuery);
      let userId;

      if (!userSnap.empty) {
        const existingUser = userSnap.docs[0].data();
        userId = existingUser.id;

        if (
          gameLobbyData.gameState === "ready" &&
          existingUser.is_playing === ""
        ) {
          toast.error("The game has already started. You cannot join now.");
          setLoadingJoin(false);
          window.location.reload();
          return;
        }

        useUserStore.getState().setCurrentUser({
          id: userId,
          username: existingUser.username,
          game_code: existingUser.game_code,
          hint_no1: existingUser.hint_no1,
          hint_no2: existingUser.hint_no2,
          avatar: existingUser.avatar,
          no_of_hints: existingUser.no_of_hints,
          points: existingUser.points,
          is_playing: existingUser.is_playing,
          guessedUsers: existingUser.guessedUsers,
        });

        toast.success("Welcome back! You have joined the game.");
      } else {
        if (gameLobbyData.gameState === "ready") {
          toast.error("The game has already started. You cannot join now.");
          setLoadingJoin(false);
          return;
        }

        if (
          gameLobbyData.participants &&
          gameLobbyData.participants.length >= 10
        ) {
          toast.error("Sorry, the lobby is full. You cannot join.");
          setLoadingJoin(false);
          return;
        }

        userId = nanoid();

        const hintRef1 = doc(collection(db, "hints"));
        const hintRef2 = doc(collection(db, "hints"));

        await setDoc(hintRef1, {
          hint: hint_no1_join,
          isSeenBy: [],
          createdAt: new Date(),
        });

        await setDoc(hintRef2, {
          hint: hint_no2_join,
          isSeenBy: [],
          createdAt: new Date(),
        });

        const hintId1 = hintRef1.id;
        const hintId2 = hintRef2.id;

        useUserStore.getState().setCurrentUser({
          id: userId,
          username: username_join,
          game_code,
          hint_no1: hintId1,
          hint_no2: hintId2,
          avatar: selectedAvatar,
          no_of_hints: 3,
          points: 0,
          is_playing: "",
          guessedUsers: [],
        });

        await updateDoc(gameLobbyRef, {
          participants: [
            ...gameLobbyData.participants,
            {
              id: userId,
            },
          ],
        });

        await setDoc(
          doc(db, "users", userId),
          {
            id: userId,
            username: username_join,
            game_code,
            hint_no1: hintId1,
            hint_no2: hintId2,
            avatar: selectedAvatar,
            no_of_hints: 3,
            points: 0,
            is_playing: "",
            guessedUsers: [],
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "userChats", userId),
          {
            chats: [],
          },
          { merge: true }
        );

        toast.success("You can join the game now!");
      }
    } catch (error) {
      toast.error(
        "An error occurred while joining the game. Please try again."
      );
      console.error(error);
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    await resetUser();
    setGameState("notReady");
    setLoadingCreate(true);

    const formData = new FormData(e.target);
    const { username_create, hint_no1_create, hint_no2_create } =
      Object.fromEntries(formData);

    if (!username_create || !hint_no1_create || !hint_no2_create) {
      toast.error("Please fill in all the fields.");
      setLoadingCreate(false);
      return;
    }

    try {
      const userId = nanoid();
      const gameCode = nanoid(6);

      const hintRef1 = doc(collection(db, "hints"));
      const hintRef2 = doc(collection(db, "hints"));

      await setDoc(hintRef1, {
        hint: hint_no1_create,
        isSeenBy: [],
        createdAt: new Date(),
      });

      await setDoc(hintRef2, {
        hint: hint_no2_create,
        isSeenBy: [],
        createdAt: new Date(),
      });

      const hintId1 = hintRef1.id;
      const hintId2 = hintRef2.id;

      await useUserStore.getState().setCurrentUser({
        id: userId,
        username: username_create,
        game_code: gameCode,
        hint_no1: hintId1,
        hint_no2: hintId2,
        avatar: avatarCreate,
        no_of_hints: 3,
        points: 0,
        is_playing: "",
        guessedUsers: [],
      });

      await setDoc(
        doc(db, "users", userId),
        {
          id: userId,
          username: username_create,
          game_code: gameCode,
          hint_no1: hintId1,
          hint_no2: hintId2,
          avatar: avatarCreate,
          no_of_hints: 3,
          points: 0,
          is_playing: "",
          guessedUsers: [],
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "userChats", userId),
        {
          chats: [],
        },
        { merge: true }
      );

      const gameLobbyRef = doc(db, "gameLobby", gameCode);
      await setDoc(
        gameLobbyRef,
        {
          gameCode,
          createdBy: userId,
          createdAt: serverTimestamp(),
          participants: [{ id: userId }],
          gameState: "notReady",
        },
        { merge: true }
      );
      toast.success(
        `Game created successfully! Share this code with others: ${gameCode}`
      );
    } catch (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game. Please try again.");
    } finally {
      setLoadingCreate(false);
    }
  };

  useEffect(() => {
    handleAvatarCreate();
    handleAvatarJoin();
  }, []);

  return (
    <div className="login">
      <div className="item">
        <h2>Join a Game</h2>
        <form onSubmit={handleJoinGame}>
          <img
            src={avatarJoin || "./avatar.png"}
            alt="Avatar"
            style={{ width: "120px", height: "120px" }}
          />
          <input
            type="text"
            placeholder="Game Code"
            name="game_code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            name="username_join"
            value={usernameJoin}
            onChange={(e) => setUsernameJoin(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hint No1"
            name="hint_no1_join"
            value={hintNo1Join}
            onChange={(e) => setHintNo1Join(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hint No2"
            name="hint_no2_join"
            value={hintNo2Join}
            onChange={(e) => setHintNo2Join(e.target.value)}
          />
          <button disabled={loadingJoin}>
            {loadingJoin ? "Loading..." : "Join a Lobby"}
          </button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create a Game</h2>
        <form onSubmit={handleCreateGame}>
          <img
            src={avatarCreate || "./avatar.png"}
            alt="Avatar"
            style={{ width: "120px", height: "120px" }}
          />
          <input
            type="text"
            placeholder="Username"
            name="username_create"
            value={usernameCreate}
            onChange={(e) => setUsernameCreate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hint No1"
            name="hint_no1_create"
            value={hintNo1Create}
            onChange={(e) => setHintNo1Create(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hint No2"
            name="hint_no2_create"
            value={hintNo2Create}
            onChange={(e) => setHintNo2Create(e.target.value)}
          />
          <button disabled={loadingCreate}>
            {loadingCreate ? "Loading..." : "Create a Lobby"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
