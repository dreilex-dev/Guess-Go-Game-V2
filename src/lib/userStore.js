import { doc, getDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { toast } from "react-toastify";

export const useUserStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,
  playingUser: null,
  allPlayers: [],
  gameState: "notReady",
  setAllPlayers: (players) => set({ allPlayers: players }),
  setGameState: (str) => set({ gameState: str }),
  setCurrentUser: async (user) => set({ currentUser: user }),
  resetUser: () => set({ currentUser: null }),

  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },

  /*incrementPoints: async () => {
    try {
      const state = get();
      const currentUser = state.currentUser;

      if (!currentUser) {
        console.log("No current user is found!");
        return;
      }
      const docRef = doc(db, "users", currentUser.id);
      await updateDoc(docRef, {
        points: (currentUser.points || 0) + 1,
      });

      set((prevState) => ({
        ...prevState,
        currentUser: {
          ...currentUser,
          points: (currentUser.points || 0) + 1,
        },
      }));
    } catch (err) {
      console.error("Error incrementing points:", err);
    }
  },*/

  addGuess: async (userId, guessedUsername) => {
    try {
      const state = get();
      const currentUser = state.currentUser;

      if (!currentUser) {
        console.error("No current user found!");
        return;
      }

      if (!currentUser.guessedUsers) {
        currentUser.guessedUsers = [];
      }

      if (currentUser.guessedUsers.includes(userId)) {
        toast.error("You have already guessed for this user!");
        return;
      }

      const isCorrectGuess =
        guessedUsername.trim().toLowerCase() ===
        state.playingUser?.username.toLowerCase();

      const docRef = doc(db, "users", currentUser.id);
      await updateDoc(docRef, {
        guessedUsers: [...currentUser.guessedUsers, userId],
        ...(isCorrectGuess && { points: (currentUser.points || 0) + 1 }),
      });

      set({
        currentUser: {
          ...currentUser,
          guessedUsers: [...currentUser.guessedUsers, userId],
          points: isCorrectGuess
            ? (currentUser.points || 0) + 1
            : currentUser.points,
        },
      });
    } catch (error) {
      console.error("Error handling guess:", error);
      toast.error("Something went wrong. Please try again.");
    }
  },

  decrementHints: async () => {
    try {
      const state = get();
      const currentUser = state.currentUser;

      if (!currentUser) {
        console.log("No current user found.");
        return;
      }

      const docRef = doc(db, "users", currentUser.id);

      if ((currentUser.no_of_hints || 0) > 0) {
        await updateDoc(docRef, {
          no_of_hints: (currentUser.no_of_hints || 0) - 1,
        });

        set((prevState) => ({
          ...prevState,
          currentUser: {
            ...currentUser,
            no_of_hints: (currentUser.no_of_hints || 0) - 1,
          },
        }));

        console.log("Hint used successfully!");
      } else {
        console.log("No more hints available.");
      }
    } catch (error) {
      console.error("Error decrementing hints:", error);
      console.log("Failed to use hint. Please try again.");
    }
  },

  setIsPlaying: async (uid, targetUserId) => {
    try {
      const docRef = doc(db, "users", uid);

      await updateDoc(docRef, { is_playing: targetUserId });
      set((state) => ({
        currentUser: { ...state.currentUser, is_playing: targetUserId },
      }));
    } catch (err) {
      console.error("Error setting isPlaying:", err);
    }
  },

  fetchPlayingUserInfo: async (targetUserId) => {
    if (!targetUserId) return set({ playingUser: null });

    try {
      const docRef = doc(db, "users", targetUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Fetched playing user data:", userData);
        set({ playingUser: userData });
      } else {
        console.log("Playing user not found");
        set({ playingUser: null });
      }
    } catch (err) {
      console.error("Error fetching playing user info:", err);
      set({ playingUser: null });
    }
  },
}));
