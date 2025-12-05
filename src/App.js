import React, { useState, useEffect } from "react";
import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment,
  deleteDoc,
  getDocs,
  writeBatch,
  runTransaction,
} from "firebase/firestore";

// --- Icon Components (Inline SVGs) ---

const MapIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 0 20 2.824v14.176a1 1 0 0 0-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 2 19.176V5a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" />
    <path d="M9 3.236v15" />
  </svg>
);

const TrophyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const QrCodeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const AlertCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const NavigationIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const MountainIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const CompassIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const LockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SettingsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PlusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const RefreshIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const EditIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SaveIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const ArrowLeftIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

// --- Configuration & Constants ---

// Default Checkpoints (Used on first run or reset)
const DEFAULT_CHECKPOINTS = [
  { id: "cp1", name: "Start Line", points: 10 },
  { id: "cp2", name: "The Old Oak", points: 20 },
  { id: "cp3", name: "River Bend", points: 30 },
  { id: "cp4", name: "Hidden Cave", points: 50 },
  { id: "cp5", name: "Top of Hill", points: 40 },
  { id: "cp6", name: "Red Barn", points: 25 },
  { id: "cp7", name: "Bridge Underpass", points: 35 },
  { id: "cp8", name: "Statue", points: 15 },
  { id: "cp9", name: "Fountain", points: 20 },
  { id: "cp10", name: "Finish Line", points: 100 },
];

const COLLECTION_NAME = "orienteering_teams";
const CONFIG_COLLECTION_NAME = "config_teams";
const CONFIG_DOC_ID = "teams_list";
const CHECKPOINTS_DOC_ID = "checkpoints_list";

const firebaseConfig = {
  apiKey: "AIzaSyDG9CWHAw5fGYiBfqOkBfjaSWxvrYKmHxE",
  authDomain: "lilliesden-orienteering.firebaseapp.com",
  projectId: "lilliesden-orienteering",
  storageBucket: "lilliesden-orienteering.firebasestorage.app",
  messagingSenderId: "748298310144",
  appId: "1:748298310144:web:e979ddb0fbbbd72add3ee5",
  measurementId: "G-JEZHG21FJY",
};

const appName = "lilliesden-orienteering-app-v2";
let app;
try {
  app = getApp(appName);
} catch (e) {
  app = initializeApp(firebaseConfig, appName);
}

const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

export default function App() {
  const [user, setUser] = useState(null);

  // -- State: Auth & Role --
  const [selectedIdentity, setSelectedIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // -- State: Data --
  const [teamName, setTeamName] = useState(""); // Holds the active team name
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teams, setTeams] = useState([]); // Leaderboard
  const [checkpoints, setCheckpoints] = useState([]); // Dynamic checkpoints
  const [myTeamData, setMyTeamData] = useState(null);

  // -- State: UI --
  const [activeTab, setActiveTab] = useState("game");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null); // For detailed view

  // -- State: Admin --
  const [newTeamName, setNewTeamName] = useState("");
  const [showResetInput, setShowResetInput] = useState(false);
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [editingCpId, setEditingCpId] = useState(null); // Which CP is being edited
  const [editCpName, setEditCpName] = useState("");
  const [editCpPoints, setEditCpPoints] = useState("");

  // Inject Tailwind CSS
  useEffect(() => {
    const existingScript = document.getElementById("tailwind-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "tailwind-script";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  // 1. Initial Authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth failed", err);
        setAuthError(err.message);
        setLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedOrg = localStorage.getItem(`orienteering_org_${appId}`);
        const storedTeam = localStorage.getItem(`orienteering_team_${appId}`);

        if (storedOrg === "true") {
          setIsOrganizer(true);
          setIsRegistered(true);
          setActiveTab("manage");
        } else if (storedTeam) {
          setTeamName(storedTeam);
          setIsRegistered(true);
          setActiveTab("game");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Synchronization
  useEffect(() => {
    if (!user) return;

    // A. Available Teams Config
    const configRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CONFIG_DOC_ID
    );
    const unsubConfig = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAvailableTeams(data.names || []);
      } else {
        setDoc(
          configRef,
          { names: ["Team Anderson", "Team Porteous"] },
          { merge: true }
        );
        setAvailableTeams(["Team Anderson", "Team Porteous"]);
      }
    });

    // B. Checkpoints Config
    const cpConfigRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CHECKPOINTS_DOC_ID
    );
    const unsubCpConfig = onSnapshot(cpConfigRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCheckpoints(data.list || DEFAULT_CHECKPOINTS);
      } else {
        setDoc(cpConfigRef, { list: DEFAULT_CHECKPOINTS }, { merge: true });
        setCheckpoints(DEFAULT_CHECKPOINTS);
      }
      if (!isRegistered) setLoading(false);
    });

    // C. Leaderboard & My Team Data
    const teamsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      COLLECTION_NAME
    );
    const unsubTeams = onSnapshot(teamsRef, (snapshot) => {
      const loadedTeams = [];
      let myData = null;

      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedTeams.push({ id: doc.id, ...data });
        // Match based on Team Name (ID) instead of User UID
        if (doc.id === teamName) {
          myData = data;
        }
      });

      loadedTeams.sort((a, b) => b.score - a.score);
      setTeams(loadedTeams);
      setMyTeamData(myData);

      if (isRegistered) setLoading(false);
    });

    return () => {
      unsubConfig();
      unsubCpConfig();
      unsubTeams();
    };
  }, [user, isRegistered, teamName]);

  // 3. QR Code Handling
  useEffect(() => {
    if (
      !user ||
      !isRegistered ||
      isOrganizer ||
      !myTeamData ||
      checkpoints.length === 0
    )
      return;

    const params = new URLSearchParams(window.location.search);
    const cpId = params.get("cp");

    if (cpId) {
      handleCheckpointScan(cpId);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, isRegistered, isOrganizer, myTeamData, checkpoints]);

  // --- Handlers ---

  const handleCheckpointScan = async (cpId) => {
    // Find checkpoint in dynamic state list
    const checkpoint = checkpoints.find((c) => c.id === cpId);

    if (!checkpoint) {
      setScanResult({
        status: "error",
        message: "Invalid or removed QR Code.",
      });
      return;
    }

    if (myTeamData && myTeamData.scanned && myTeamData.scanned.includes(cpId)) {
      setScanResult({
        status: "error",
        message: `Already found ${checkpoint.name}!`,
      });
      return;
    }

    try {
      const teamRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        COLLECTION_NAME,
        teamName
      );
      const pointsToAdd = parseInt(checkpoint.points, 10) || 0;
      const timestamp = new Date().toISOString();
      const scanEntry = {
        id: cpId,
        name: checkpoint.name,
        points: pointsToAdd,
        timestamp: timestamp,
      };

      await runTransaction(db, async (transaction) => {
        const teamDoc = await transaction.get(teamRef);
        if (!teamDoc.exists()) {
          throw "Team does not exist";
        }

        const data = teamDoc.data();
        const scannedList = data.scanned || [];

        if (scannedList.includes(cpId)) {
          throw "Already scanned";
        }

        const newScore = (data.score || 0) + pointsToAdd;

        transaction.update(teamRef, {
          score: newScore,
          scanned: arrayUnion(cpId),
          scanHistory: arrayUnion(scanEntry),
          lastUpdated: new Date(),
        });
      });

      setScanResult({
        status: "success",
        message: `Discovered ${checkpoint.name}`,
        points: pointsToAdd,
      });
    } catch (error) {
      if (error === "Already scanned") {
        setScanResult({
          status: "error",
          message: `Already found ${checkpoint.name}!`,
        });
      } else {
        console.error("Score update error", error);
        setScanResult({
          status: "error",
          message: "Connection failed. Try again.",
        });
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIdentity) return;
    setLoginError("");

    if (selectedIdentity === "Admin") {
      if (password === "Jasper") {
        setIsOrganizer(true);
        setIsRegistered(true);
        localStorage.setItem(`orienteering_org_${appId}`, "true");
        setActiveTab("manage");
      } else {
        setLoginError("Incorrect Password");
      }
    } else {
      setLoading(true);
      try {
        // Use Team Name as the Document ID
        const teamRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          COLLECTION_NAME,
          selectedIdentity
        );

        // Check if team exists first to prevent overwriting existing progress
        const docSnap = await getDoc(teamRef);

        if (!docSnap.exists()) {
          await setDoc(teamRef, {
            name: selectedIdentity,
            score: 0,
            scanned: [],
            scanHistory: [],
            createdAt: new Date(),
          });
        }

        setTeamName(selectedIdentity);
        localStorage.setItem(`orienteering_team_${appId}`, selectedIdentity);
        setIsRegistered(true);
        setActiveTab("game");
      } catch (err) {
        console.error("Team join error", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const configRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CONFIG_DOC_ID
    );
    try {
      await updateDoc(configRef, {
        names: arrayUnion(newTeamName.trim()),
      });
      setNewTeamName("");
    } catch (e) {
      console.error("Add team error", e);
    }
  };

  const handleDeleteTeam = async (nameToDelete) => {
    const configRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CONFIG_DOC_ID
    );
    const newNames = availableTeams.filter((n) => n !== nameToDelete);
    await setDoc(configRef, { names: newNames }, { merge: true });
  };

  // --- New Checkpoint Editing Handlers ---

  const handleAddCheckpoint = async () => {
    const newId = `cp${Date.now()}`; // Simple unique ID based on timestamp
    const newCp = { id: newId, name: "New Checkpoint", points: 10 };
    const newList = [...checkpoints, newCp];

    const cpConfigRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CHECKPOINTS_DOC_ID
    );
    try {
      await setDoc(cpConfigRef, { list: newList }, { merge: true });
      startEditingCheckpoint(newCp); // Immediately start editing the new one
    } catch (e) {
      alert("Failed to add checkpoint");
    }
  };

  const handleDeleteCheckpoint = async (idToDelete) => {
    // No browser confirm, execute immediately
    const newList = checkpoints.filter((cp) => cp.id !== idToDelete);
    const cpConfigRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CHECKPOINTS_DOC_ID
    );
    try {
      await setDoc(cpConfigRef, { list: newList }, { merge: true });
    } catch (e) {
      alert("Failed to delete checkpoint");
    }
  };

  const startEditingCheckpoint = (cp) => {
    setEditingCpId(cp.id);
    setEditCpName(cp.name);
    setEditCpPoints(cp.points);
  };

  const saveCheckpoint = async (cpId) => {
    const cpConfigRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      CONFIG_COLLECTION_NAME,
      CHECKPOINTS_DOC_ID
    );
    const newCheckpoints = checkpoints.map((cp) => {
      if (cp.id === cpId) {
        return {
          ...cp,
          name: editCpName,
          points: parseInt(editCpPoints, 10) || 0,
        };
      }
      return cp;
    });

    try {
      await setDoc(cpConfigRef, { list: newCheckpoints }, { merge: true });
      setEditingCpId(null);
    } catch (e) {
      alert("Failed to save checkpoint");
    }
  };

  const cancelEdit = () => {
    setEditingCpId(null);
  };

  const handleFactoryReset = async (e) => {
    e.preventDefault();
    if (resetPasswordInput !== "reset") {
      alert("Incorrect Reset Password");
      return;
    }

    setLoading(true);
    try {
      const batch = writeBatch(db);
      const teamsRef = collection(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        COLLECTION_NAME
      );
      const snapshot = await getDocs(teamsRef);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      const configRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        CONFIG_COLLECTION_NAME,
        CONFIG_DOC_ID
      );
      await setDoc(configRef, { names: ["Team Anderson", "Team Porteous"] });

      // Also reset checkpoints to default
      const cpConfigRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        CONFIG_COLLECTION_NAME,
        CHECKPOINTS_DOC_ID
      );
      await setDoc(cpConfigRef, { list: DEFAULT_CHECKPOINTS });

      setShowResetInput(false);
      setResetPasswordInput("");
      alert("Application Reset Complete.");
    } catch (err) {
      console.error("Reset failed", err);
      alert("Reset failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(`orienteering_org_${appId}`);
      localStorage.removeItem(`orienteering_team_${appId}`);
      await signOut(auth);
      await signInAnonymously(auth);

      setIsOrganizer(false);
      setIsRegistered(false);
      setSelectedIdentity("");
      setPassword("");
      setMyTeamData(null);
      setTeamName("");
      setActiveTab("game");
      setSelectedTeamDetail(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // --- Render Helpers ---

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800 ring-2 ring-yellow-300 ring-offset-2 ring-offset-white";
      case 1:
        return "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-700 ring-2 ring-slate-300 ring-offset-2 ring-offset-white";
      case 2:
        return "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 text-orange-800 ring-2 ring-orange-300 ring-offset-2 ring-offset-white";
      default:
        return "bg-white border-stone-100 text-stone-500";
    }
  };

  const getMedalIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return <span className="text-sm font-bold opacity-50">{index + 1}</span>;
  };

  // --- Views ---

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MountainIcon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="imageAG.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay & Blur */}
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>
        </div>

        <div className="z-10 w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-700 text-center relative">
          {/* LOGO SECTION WITH IMAGE BACKGROUND */}
          <div className="inline-flex p-0 rounded-3xl overflow-hidden relative shadow-2xl mb-4 w-24 h-24">
            {/* Placeholder for the background image of the logo */}
            <img
              src="image.jpg"
              alt="Logo Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay the white compass icon */}
            <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/20">
              <CompassIcon className="w-14 h-14 text-white drop-shadow-md" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
            Lilliesden OMM
          </h1>

          <form
            onSubmit={handleLoginSubmit}
            className="space-y-4 pt-4 bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl"
          >
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-white/80 uppercase tracking-widest ml-1">
                Select your team name
              </label>
              <div className="relative">
                <select
                  value={selectedIdentity}
                  onChange={(e) => {
                    setSelectedIdentity(e.target.value);
                    setPassword("");
                    setLoginError("");
                  }}
                  className="w-full appearance-none bg-stone-900/80 border border-stone-600 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                >
                  <option value="" disabled>
                    -- Choose --
                  </option>
                  <option value="Admin">Admin</option>
                  <optgroup label="Available Teams">
                    {availableTeams.map((name) =>
                      typeof name === "string" ? (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ) : null
                    )}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {selectedIdentity === "Admin" && (
              <div className="space-y-2 text-left animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-white/80 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-900/80 border border-stone-600 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••"
                  autoFocus
                />
              </div>
            )}

            {loginError && (
              <div className="text-red-300 text-sm font-bold text-center bg-red-900/40 py-2 rounded-lg border border-red-500/30">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedIdentity}
              className={`w-full font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 mt-4 ${
                selectedIdentity
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/50"
                  : "bg-stone-800/50 text-stone-500 cursor-not-allowed border border-stone-700"
              }`}
            >
              {selectedIdentity === "Admin"
                ? "Access Dashboard"
                : "Start Adventure"}
              {selectedIdentity === "Admin" ? (
                <LockIcon className="w-4 h-4" />
              ) : (
                <NavigationIcon className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: TEAM DETAIL MODAL ---
  if (selectedTeamDetail) {
    const sortedHistory = selectedTeamDetail.scanHistory
      ? [...selectedTeamDetail.scanHistory].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      : [];

    return (
      <div className="min-h-screen bg-stone-50 font-sans max-w-md mx-auto shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 pb-8 rounded-b-3xl shadow-xl">
          <button
            onClick={() => setSelectedTeamDetail(null)}
            className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </button>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-black">{selectedTeamDetail.name}</h2>
            <div className="text-stone-400 text-sm font-medium mt-1">
              Trail Log
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <div className="bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
                <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
                  Points
                </div>
                <div className="text-2xl font-black text-emerald-100">
                  {selectedTeamDetail.score}
                </div>
              </div>
              <div className="bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                <div className="text-xs text-blue-400 uppercase font-bold tracking-wider">
                  Found
                </div>
                <div className="text-2xl font-black text-blue-100">
                  {sortedHistory.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sortedHistory.length === 0 ? (
            <div className="text-center text-stone-400 mt-10">
              No checkpoints found yet.
            </div>
          ) : (
            sortedHistory.map((scan, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Line connecting dots */}
                {index !== sortedHistory.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-stone-200"></div>
                )}

                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm"></div>
                </div>
                <div className="flex-1 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-stone-800">
                        {scan.name || "Unknown"}
                      </div>
                      <div className="text-xs text-stone-400 font-mono mt-1">
                        {formatTime(scan.timestamp)}
                      </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                      +{scan.points}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- APP INTERFACE (Organizer & Participant) ---
  return (
    <div className="min-h-screen bg-stone-50 font-sans max-w-md mx-auto shadow-2xl relative flex flex-col">
      {/* --- Overlay Modal (Scan Results) --- */}
      {scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                scanResult.status === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {scanResult.status === "success" ? (
                <TrophyIcon className="w-10 h-10" />
              ) : (
                <AlertCircleIcon className="w-10 h-10" />
              )}
            </div>
            <h3 className="text-2xl font-black text-stone-800 mb-1">
              {scanResult.status === "success"
                ? `+${scanResult.points} pts`
                : "Wait!"}
            </h3>
            <p className="text-stone-500 font-medium mb-6 leading-relaxed">
              {scanResult.message}
            </p>
            <button
              onClick={() => setScanResult(null)}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <div className="bg-white pb-6 pt-4 px-6 rounded-b-[2.5rem] shadow-lg z-10 sticky top-0 border-b border-stone-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
              {isOrganizer ? "Organizer Mode" : "Current Team"}
            </span>
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              {isOrganizer
                ? "Admin Dashboard"
                : myTeamData?.name || selectedIdentity}
              {!isOrganizer && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  Active
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition"
            title="Logout"
          >
            <LockIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Score Card (Only for Players) */}
        {!isOrganizer && (
          <div className="bg-stone-900 rounded-3xl p-6 text-white shadow-xl shadow-stone-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Total Score
                </div>
                <div className="text-5xl font-black tracking-tighter">
                  {myTeamData?.score || 0}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 border border-white/10">
                {myTeamData?.scanned?.length || 0} / {checkpoints.length} Found
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6 space-y-6">
        {/* TAB: GAME (Trail) - Participants Only */}
        {activeTab === "game" && !isOrganizer && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-stone-800 text-lg">
                Checkpoint Trail
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {Math.round(
                  ((myTeamData?.scanned?.length || 0) /
                    Math.max(checkpoints.length, 1)) *
                    100
                )}
                % Complete
              </span>
            </div>

            <div className="relative space-y-0 pl-4">
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-stone-200"></div>
              {checkpoints.map((cp, idx) => {
                const isScanned = myTeamData?.scanned?.includes(cp.id);
                return (
                  <div
                    key={cp.id}
                    className="relative flex items-center gap-4 py-3 group"
                  >
                    <div
                      className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300 ${
                        isScanned
                          ? "border-emerald-500 scale-110"
                          : "border-stone-300"
                      }`}
                    >
                      {isScanned && (
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-2xl border transition-all duration-300 ${
                        isScanned
                          ? "bg-white border-emerald-100 shadow-lg shadow-emerald-500/5"
                          : "bg-white border-stone-100 shadow-sm opacity-80"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div
                            className={`font-bold text-sm ${
                              isScanned ? "text-stone-800" : "text-stone-500"
                            }`}
                          >
                            {cp.name}
                          </div>
                          <div className="text-xs text-stone-400 font-medium">
                            {cp.points} Points
                          </div>
                        </div>
                        {isScanned ? (
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <div className="text-xs font-bold text-stone-300 bg-stone-50 px-2 py-1 rounded-md">
                            #{idx + 1}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: LEADERBOARD (Everyone) */}
        {activeTab === "leaderboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <h3 className="font-bold text-stone-800 text-lg px-2">Top Teams</h3>
            {teams.map((team, index) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeamDetail(team)} // Click to view details
                className={`relative flex items-center p-4 rounded-3xl transition-all cursor-pointer hover:bg-stone-50 active:scale-95 ${
                  index < 3 ? "mb-3" : "mb-2"
                } ${getRankStyle(index)} ${
                  team.id === teamName
                    ? "shadow-lg scale-[1.02]"
                    : "bg-white shadow-sm border border-stone-100"
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-xl mr-4">
                  {getMedalIcon(index)}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-bold text-sm ${
                      team.id === teamName ? "text-black" : "text-stone-700"
                    }`}
                  >
                    {team.name}
                    {team.id === teamName && (
                      <span className="ml-2 text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-60 font-medium">
                    {team.scanned?.length || 0} checkpoints
                  </div>
                </div>
                <div className="font-black text-lg">{team.score}</div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 text-stone-400">
                No explorers yet.
              </div>
            )}
          </div>
        )}

        {/* TAB: MANAGE TEAMS (Organizer Only) */}
        {activeTab === "manage" && isOrganizer && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Add Team */}
            <div className="bg-stone-900 text-white p-5 rounded-3xl">
              <h3 className="font-bold text-lg mb-4">Add New Team</h3>
              <form onSubmit={handleAddTeam} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Team C"
                  className="flex-1 bg-stone-800 border-none rounded-xl px-4 text-white focus:ring-2 focus:ring-emerald-500"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* List Teams */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest px-2">
                Configured Teams
              </div>
              {availableTeams.map((name) =>
                typeof name === "string" ? (
                  <div
                    key={name}
                    className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm"
                  >
                    <span className="font-bold text-stone-700">{name}</span>
                    <button
                      onClick={() => handleDeleteTeam(name)}
                      className="text-stone-300 hover:text-red-500 transition p-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : null
              )}
            </div>

            {/* Checkpoint Editor (NEW) */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center px-2">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Edit Checkpoints
                </div>
                <button
                  onClick={handleAddCheckpoint}
                  className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition flex items-center gap-1"
                >
                  <PlusIcon className="w-3 h-3" /> Add
                </button>
              </div>
              {checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm"
                >
                  {editingCpId === cp.id ? (
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={editCpName}
                          onChange={(e) => setEditCpName(e.target.value)}
                          className="w-full border rounded p-1 text-sm font-bold"
                          placeholder="Name"
                        />
                        <input
                          type="number"
                          value={editCpPoints}
                          onChange={(e) => setEditCpPoints(e.target.value)}
                          className="w-full border rounded p-1 text-sm"
                          placeholder="Points"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        <button
                          onClick={() => saveCheckpoint(cp.id)}
                          className="bg-emerald-100 text-emerald-700 p-2 rounded-lg"
                        >
                          <SaveIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-stone-100 text-stone-500 p-2 rounded-lg"
                        >
                          <span className="text-xs font-bold">X</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-700 text-sm">
                          {cp.name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {cp.points} Points
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingCheckpoint(cp)}
                          className="text-emerald-600 bg-emerald-50 p-2 rounded-xl"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCheckpoint(cp.id)}
                          className="text-red-400 bg-red-50 p-2 rounded-xl"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Danger Zone: Reset App */}
            <div className="mt-8 border-t-2 border-stone-100 pt-6">
              {!showResetInput ? (
                <button
                  onClick={() => setShowResetInput(true)}
                  className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <RefreshIcon className="w-5 h-5" /> Reset Application
                </button>
              ) : (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-red-800 font-bold text-sm mb-2 text-center">
                    WARNING: This wipes all data!
                  </div>
                  <form onSubmit={handleFactoryReset} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type 'reset' to confirm"
                      value={resetPasswordInput}
                      onChange={(e) => setResetPasswordInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-red-700"
                    >
                      Wipe
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetInput(false);
                        setResetPasswordInput("");
                      }}
                      className="text-stone-500 px-3 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CODES (Organizer Only) */}
        {activeTab === "codes" && isOrganizer && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl text-blue-800 text-sm">
              <strong>Organizer Mode:</strong> Print these QR codes and place
              them at locations.
            </div>
            {checkpoints.map((cp) => {
              const currentUrl = window.location.href.split("?")[0];
              const targetUrl = `${currentUrl}?cp=${cp.id}`;
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                targetUrl
              )}`;
              return (
                <div
                  key={cp.id}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center gap-4 break-inside-avoid"
                >
                  <div className="text-lg font-black text-stone-800">
                    {cp.name}
                  </div>
                  <div className="p-3 bg-white border-2 border-stone-900 rounded-2xl">
                    <img
                      src={qrUrl}
                      alt={`QR for ${cp.name}`}
                      className="w-32 h-32"
                    />
                  </div>
                  <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Value: {cp.points} Points
                  </div>
                  <div className="text-[10px] text-stone-300 font-mono break-all max-w-full">
                    {targetUrl}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-6 left-6 right-6 z-40">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl shadow-stone-500/20 flex justify-between items-center max-w-sm mx-auto">
          {!isOrganizer ? (
            // Participant Tabs
            <>
              {[
                { id: "game", icon: MapIcon, label: "Trail" },
                { id: "leaderboard", icon: TrophyIcon, label: "Ranks" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-stone-900 text-white shadow-lg"
                        : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 mb-0.5 ${
                        isActive ? "stroke-2" : "stroke-[1.5]"
                      }`}
                    />
                    <span className="text-[10px] font-bold tracking-wide">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            // Organizer Tabs
            <>
              {[
                { id: "manage", icon: SettingsIcon, label: "Manage" },
                { id: "leaderboard", icon: TrophyIcon, label: "Ranks" },
                { id: "codes", icon: QrCodeIcon, label: "Codes" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-stone-900 text-white shadow-lg"
                        : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 mb-0.5 ${
                        isActive ? "stroke-2" : "stroke-[1.5]"
                      }`}
                    />
                    <span className="text-[10px] font-bold tracking-wide">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

