import React, { useState, useEffect } from "react";
import { initializeApp, getApp } from "firebase/app";
import { Html5Qrcode } from "html5-qrcode";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  increment,
  getDocs,
  writeBatch,
} from "firebase/firestore";

// --- Icon Components ---

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

const GpsIcon = (props) => (
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
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const UploadIcon = (props) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const WifiIcon = (props) => (
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
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const WifiOffIcon = (props) => (
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
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
    <path d="M1.42 9a16 16 0 0 1 5.46-.72" />
    <path d="M15.54 8.78a16 16 0 0 1 7.04.22" />
    <path d="M5 12.55a11 11 0 0 1 3.52-.76" />
    <path d="M14.05 11.96a11 11 0 0 1 5.03.59" />
  </svg>
);

const CloseIcon = (props) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = (props) => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MessageIcon = (props) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// --- Configuration & Constants ---

const DEFAULT_CHECKPOINTS = [
  { id: "c1", name: "C1 (West Lomond Summit)",    points: 30, lat: 56.24532608, lng: -3.296702687, clue: "" },
  { id: "c2", name: "C2 (East Lomond Summit)",    points: 50, lat: 56.24239271, lng: -3.221353623, clue: "" },
  { id: "c3", name: "C3 (East Lomond Walkway)",   points: 10, lat: 56.24108072, lng: -3.239071385, clue: "" },
  { id: "c4", name: "C4 (West Lomond Expanse)",   points: 40, lat: 56.24524392, lng: -3.282809547, clue: "" },
  { id: "c5", name: "C5 (Falkland Moss)",         points: 20, lat: 56.24047950, lng: -3.254069652, clue: "" },
  { id: "c6", name: "C6 (Hut Circles)",           points: 20, lat: 56.24612646, lng: -3.267110455, clue: "" },
  { id: "c7", name: "C7 (Maspie Den)",            points: 30, lat: 56.24740169, lng: -3.236934555, clue: "" },
  { id: "c8", name: "C8 (Temple)",                points: 30, lat: 56.24918311, lng: -3.242424014, clue: "" },
  { id: "c9", name: "C9 (Tyndall Bruce)",         points: 40, lat: 56.25414750, lng: -3.246879051, clue: "" },
  { id: "d0", name: "D0 (Ballo Reservoir)",       points: 40, lat: 56.23090191, lng: -3.243224211, clue: "" },
  { id: "d1", name: "D1 (Harperleas Weir)",       points: 50, lat: 56.23145229, lng: -3.270445581, clue: "" },
  { id: "d2", name: "D2 (Druman Expanse)",        points: 50, lat: 56.22756011, lng: -3.264656986, clue: "" },
  { id: "d3", name: "D3 (Edge Head)",             points: 50, lat: 56.24369203, lng: -3.303629114, clue: "" },
  { id: "d4", name: "D4 (John Knox)",             points: 50, lat: 56.23704317, lng: -3.305810075, clue: "" },
  { id: "d5", name: "D5 (Towards Bishop Hill)",   points: 50, lat: 56.22535234, lng: -3.289570354, clue: "" },
  { id: "d6", name: "D6 (Druman Weir)",           points: 30, lat: 56.22633731, lng: -3.252282988, clue: "" },
  { id: "d7", name: "D7 (Drumdreel Wood)",        points: 50, lat: 56.25471973, lng: -3.281304956, clue: "" },
  { id: "d8", name: "D8 (Green Hill)",            points: 40, lat: 56.25028739, lng: -3.254897208, clue: "" },
  { id: "d9", name: "D9 (Harperleas Edge)",       points: 30, lat: 56.23577458, lng: -3.273142920, clue: "" },
  { id: "e0", name: "E0 (Damdub Expanse)",        points: 40, lat: 56.23793036, lng: -3.232194752, clue: "" },
];

const GPS_RADIUS_METERS = 50; // Default check-in radius (can be overridden per race)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const appName = "lomond-omm-app";
let app;
try {
  app = getApp(appName);
} catch (e) {
  app = initializeApp(firebaseConfig, appName);
}

const auth = getAuth(app);
// persistentLocalCache enables full offline support (IndexedDB) — no separate call needed
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
const appId = "lomond-omm";

// --- Helper Functions ---

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const generateRaceCode = () =>
  Math.random().toString(36).substring(2, 6).toUpperCase();

// --- QR Scanner Component (Improved) ---
const QrScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Initialize logic
    const html5QrCode = new Html5Qrcode("reader");
    
    // 2. Start Scanner
    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // Prefer back camera
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Success
            html5QrCode.stop().then(() => {
                onScan(decodedText);
            }).catch(err => console.error("Stop failed", err));
          },
          (errorMessage) => {
            // Scan error (ignore usually)
          }
        );
      } catch (err) {
        console.error("Camera start error", err);
        setError("Camera failed. Ensure you are on HTTPS and gave permission.");
      }
    };

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
        startScanner();
    }, 100);

    // 3. Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop", err));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full z-50"
      >
        <CloseIcon className="w-8 h-8" />
      </button>
      
      {/* The scanning container */}
      <div id="reader" className="w-full max-w-sm bg-black overflow-hidden rounded-xl"></div>
      
      <p className="text-white mt-4 font-bold animate-pulse">
        {error ? <span className="text-red-400">{error}</span> : "Scanning..."}
      </p>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  // -- Global State --
  const [view, setView] = useState("landing");
  const [raceCode, setRaceCode] = useState("");

  // -- Race Data State --
  const [raceConfig, setRaceConfig] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // -- DYNAMIC SHARED STATE --
  // Instead of waiting for a manual update, we just find the data from the live stream
  const myTeamData = teams.find(t => t.id === teamName) || null;

  // -- Form States --
  const [createForm, setCreateForm] = useState({
    name: "",
    password: "",
    bgUrl: "",
    logoUrl: "",
  });
  const [joinCode, setJoinCode] = useState("");
  const [selectedIdentity, setSelectedIdentity] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // -- Master Admin State --
  const [masterPassword, setMasterPassword] = useState("");
  const [allRaces, setAllRaces] = useState([]);

  // -- UI States --
  const [activeTab, setActiveTab] = useState("game");
  const [scanResult, setScanResult] = useState(null);
  const [gpsLoadingId, setGpsLoadingId] = useState(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState(null);
  
  // -- QR/Clue UI States --
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanningCpId, setScanningCpId] = useState(null);
  const [adminQrModalId, setAdminQrModalId] = useState(null);
  const [viewingClueCp, setViewingClueCp] = useState(null);

  // -- Admin UI State --
  const [newTeamName, setNewTeamName] = useState("");
  const [showResetInput, setShowResetInput] = useState(false);
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [editingCpId, setEditingCpId] = useState(null);
  const [editCpName, setEditCpName] = useState("");
  const [editCpPoints, setEditCpPoints] = useState("");
  const [editCpLat, setEditCpLat] = useState("");
  const [editCpLng, setEditCpLng] = useState("");
  const [editCpClue, setEditCpClue] = useState("");

  // Setup Online/Offline Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 1. Initial Authentication with Persistence
  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth failed", err);
        setLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const savedRace = localStorage.getItem(`omm_race_${appId}`);
        if (savedRace) {
          setRaceCode(savedRace);
          loadRace(savedRace);
        } else {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // -- Core Logic: Load Race --
  const loadRace = async (code) => {
    setLoading(true);
    try {
      const raceRef = doc(db, "artifacts", appId, "public", "data", "races", code);

      const unsubConfig = onSnapshot(raceRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRaceConfig(data);
          setAvailableTeams(data.teamsList || []);
          setCheckpoints(data.checkpointsList || []);
          setRaceCode(code);
          setView("race");
          localStorage.setItem(`omm_race_${appId}`, code);

          const savedTeam = localStorage.getItem(`omm_team_${code}`);
          const savedAdmin = localStorage.getItem(`omm_admin_${code}`);

          if (savedAdmin === "true") {
            setIsAdmin(true);
            setActiveTab("manage");
          } else if (savedTeam) {
            setTeamName(savedTeam);
          }
        } else {
          setErrorMsg("Race code not found.");
          localStorage.removeItem(`omm_race_${appId}`);
          setView("landing");
        }
        setLoading(false);
      }, (error) => {
        console.error("Firestore race error:", error.code, error.message);
        setErrorMsg(`Error: ${error.code === "permission-denied" ? "Database access denied. Check Firestore security rules." : error.message}`);
        setView("landing");
        setLoading(false);
      });

      const teamsRef = collection(db, "artifacts", appId, "public", "data", "races", code, "teams");
      const unsubTeams = onSnapshot(teamsRef, (snapshot) => {
        const loadedTeams = [];
        snapshot.forEach((doc) => {
          loadedTeams.push({ id: doc.id, ...doc.data() });
        });
        loadedTeams.sort((a, b) => b.score - a.score);
        setTeams(loadedTeams);
      }, (error) => {
        console.error("Firestore teams error:", error.code, error.message);
      });

      return () => {
        unsubConfig();
        unsubTeams();
      };
    } catch (e) {
      console.error("Load race error", e);
      setErrorMsg("Failed to connect. Check your internet connection.");
      setView("landing");
      setLoading(false);
    }
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file);
      setCreateForm((prev) => ({ ...prev, [field]: compressedDataUrl }));
    } catch (err) {
      alert("Failed to process image.");
    }
  };

  const handleCreateRace = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.password) return;
    setLoading(true);
    const newCode = generateRaceCode();
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", newCode);
    try {
      await setDoc(raceRef, {
        raceName: createForm.name,
        adminPassword: createForm.password,
        backgroundUrl: createForm.bgUrl || "background_image.jpg",
        logoUrl: createForm.logoUrl || "image.jpg",
        checkInMethod: "GPS",
        gpsRadius: GPS_RADIUS_METERS,
        teamsList: ["The Anderson Amblers", "The Porteous Patrollers"],
        checkpointsList: DEFAULT_CHECKPOINTS,
        createdAt: new Date(),
      });
      localStorage.setItem(`omm_admin_${newCode}`, "true");
      await loadRace(newCode);
    } catch (err) {
      setErrorMsg("Failed to create race.");
      setLoading(false);
    }
  };

  const handleJoinRace = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    const code = joinCode.toUpperCase();
    loadRace(code);
  };

  // --- Master Admin Logic ---
  const handleMasterLogin = (e) => {
    e.preventDefault();
    if (masterPassword === "Jasper") {
      loadAllRaces();
    } else {
      setErrorMsg("Incorrect Master Password");
    }
  };

  const loadAllRaces = async () => {
    setLoading(true);
    try {
      const racesRef = collection(db, "artifacts", appId, "public", "data", "races");
      const snapshot = await getDocs(racesRef);
      const racesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllRaces(racesList);
      setView("master_dashboard");
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load races");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRace = async (raceId) => {
    if (!window.confirm(`Permanently delete race ${raceId}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const teamsRef = collection(db, "artifacts", appId, "public", "data", "races", raceId, "teams");
      const teamsSnap = await getDocs(teamsRef);
      const batch = writeBatch(db);
      teamsSnap.forEach((doc) => batch.delete(doc.ref));

      const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceId);
      batch.delete(raceRef);

      await batch.commit();
      setAllRaces((prev) => prev.filter((r) => r.id !== raceId));
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (selectedIdentity === "Admin") {
      if (passwordInput === raceConfig.adminPassword) {
        setIsAdmin(true);
        localStorage.setItem(`omm_admin_${raceCode}`, "true");
        setActiveTab("manage");
      } else {
        setErrorMsg("Incorrect Password");
      }
    } else {
      setLoading(true);
      try {
        const teamRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode, "teams", selectedIdentity);
        await setDoc(teamRef, { name: selectedIdentity, score: 0, scanned: [], scanHistory: [] }, { merge: true });
        setTeamName(selectedIdentity);
        localStorage.setItem(`omm_team_${raceCode}`, selectedIdentity);
        setActiveTab("game");
      } catch (err) {
        console.error("Team join error", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // -- SHARED CHECK IN LOGIC --
  const performCheckIn = async (cpId, method, userCoords = null) => {
    const checkpoint = checkpoints.find((c) => c.id === cpId);

    // Safety check
    if (!checkpoint) {
       setScanResult({ status: "error", message: "Invalid Checkpoint ID detected." });
       logAttempt(cpId, "Unknown checkpoint ID", userCoords);
       return;
    }

    // Check duplication
    if (myTeamData?.scanned?.includes(cpId)) {
        setScanResult({ status: "error", message: `Already checked in at ${checkpoint.name}!` });
        logAttempt(cpId, "Already checked in", userCoords);
        return;
    }

    try {
        const teamRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode, "teams", teamName);
        const points = parseInt(checkpoint.points, 10) || 0;
        const now = new Date();

        await updateDoc(teamRef, {
            score: increment(points),
            scanned: arrayUnion(cpId),
            scanHistory: arrayUnion({
              id: cpId,
              name: checkpoint.name,
              points: points,
              timestamp: now.toISOString(),
              date: now.toLocaleDateString("en-GB"),
              time: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              method: method,
              cpLat: parseFloat(checkpoint.lat) || null,
              cpLng: parseFloat(checkpoint.lng) || null,
              userLat: userCoords ? userCoords.latitude : null,
              userLng: userCoords ? userCoords.longitude : null,
              userAccuracy: userCoords ? Math.round(userCoords.accuracy) : null,
            }),
            lastUpdated: new Date(),
        });

        // SUCCESS!
        setScanResult({
            status: "success",
            message: `Checked in at ${checkpoint.name}!`,
            points: points,
            clue: checkpoint.clue || "" // Pass the clue to the modal
        });
    } catch (err) {
        console.error("Save Error", err);
        setScanResult({ status: "error", message: "Save failed. Try again." });
    }
  };


  // -- GPS CHECKIN --
  const handleGpsCheckIn = async (cpId) => {
    setGpsLoadingId(cpId);
    const checkpoint = checkpoints.find((c) => c.id === cpId);

    if (!checkpoint || !checkpoint.lat || !checkpoint.lng) {
      setScanResult({ status: "error", message: "Invalid GPS coordinates." });
      setGpsLoadingId(null);
      return;
    }

    if (!navigator.geolocation) {
      setScanResult({ status: "error", message: "Geolocation not supported." });
      setGpsLoadingId(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const dist = getDistanceFromLatLonInMeters(
          position.coords.latitude,
          position.coords.longitude,
          parseFloat(checkpoint.lat),
          parseFloat(checkpoint.lng)
        );

        const radius = raceConfig?.gpsRadius || GPS_RADIUS_METERS;
        if (dist <= radius) {
          await performCheckIn(cpId, "GPS", position.coords);
        } else {
          const rounded = Math.round(dist);
          setScanResult({
            status: "error",
            message: `Too far! You are ${rounded}m away (need to be within ${radius}m).`,
          });
          logAttempt(cpId, `Too far — ${rounded}m away (limit ${radius}m)`, position.coords, { distanceMetres: rounded });
        }
        setGpsLoadingId(null);
      },
      (err) => {
        setScanResult({ status: "error", message: "GPS Error. Allow permissions." });
        logAttempt(cpId, `GPS error: ${err.message || err.code}`, null);
        setGpsLoadingId(null);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  // -- QR CHECKIN --
  const handleQrScan = async (decodedText) => {
      setShowQrScanner(false);
      const matchingCp = checkpoints.find(c => c.id === decodedText);
      if (matchingCp) {
          // Try to capture GPS position for logging (3s timeout, non-blocking)
          let userCoords = null;
          try {
              userCoords = await new Promise((resolve) => {
                  navigator.geolocation.getCurrentPosition(
                      (pos) => resolve(pos.coords),
                      () => resolve(null),
                      { enableHighAccuracy: true, timeout: 3000, maximumAge: 5000 }
                  );
              });
          } catch (e) { /* GPS unavailable — proceed without */ }
          performCheckIn(matchingCp.id, "QR", userCoords);
      } else {
          setScanResult({ status: 'error', message: `Unknown QR Code: ${decodedText}`});
          logAttempt(decodedText, `Unknown QR code scanned: ${decodedText}`, null);
      }
      setScanningCpId(null);
  };

  const startQrScanner = (targetCpId = null) => {
      setScanningCpId(targetCpId);
      setShowQrScanner(true);
  };

  // -- Attempt Logging --
  const logAttempt = async (cpId, reason, userCoords = null, extra = {}) => {
    if (!teamName) return;
    try {
      const teamRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode, "teams", teamName);
      const now = new Date();
      await updateDoc(teamRef, {
        attemptLog: arrayUnion({
          cpId,
          cpName: checkpoints.find((c) => c.id === cpId)?.name || cpId,
          reason,
          timestamp: now.toISOString(),
          date: now.toLocaleDateString("en-GB"),
          time: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          userLat: userCoords ? userCoords.latitude : null,
          userLng: userCoords ? userCoords.longitude : null,
          userAccuracy: userCoords ? Math.round(userCoords.accuracy) : null,
          ...extra,
        }),
      });
    } catch (err) {
      console.error("Failed to log attempt:", err);
    }
  };

  // -- Admin Actions --
  const handleUpdateGpsRadius = async (metres) => {
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    await updateDoc(raceRef, { gpsRadius: metres });
  };

  const handleToggleCheckInMethod = async (newMethod) => {
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    await updateDoc(raceRef, { checkInMethod: newMethod });
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    await updateDoc(raceRef, { teamsList: arrayUnion(newTeamName.trim()) });
    setNewTeamName("");
  };

  const handleDeleteTeam = async (name) => {
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    const newTeams = availableTeams.filter((t) => t !== name);
    await updateDoc(raceRef, { teamsList: newTeams });
  };

  const startEditingCheckpoint = (cp) => {
    setEditingCpId(cp.id);
    setEditCpName(cp.name);
    setEditCpPoints(cp.points);
    setEditCpLat(cp.lat || "");
    setEditCpLng(cp.lng || "");
    setEditCpClue(cp.clue || "");
  };

  const handleDeleteCheckpoint = async (id) => {
    const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    const newCps = checkpoints.filter((c) => c.id !== id);
    await updateDoc(raceRef, { checkpointsList: newCps });
  };

  const handleAddCheckpoint = async () => {
    const newId = `cp${Date.now()}`;
    const newCp = { id: newId, name: "New Checkpoint", points: 10, lat: 0, lng: 0, clue: "" };
    const newList = [...checkpoints, newCp];
    const cpConfigRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    try {
      await updateDoc(cpConfigRef, { checkpointsList: newList });
      startEditingCheckpoint(newCp);
    } catch (e) {
      alert("Failed to add checkpoint");
    }
  };

  const saveCheckpoint = async (cpId) => {
    const cpConfigRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
    const newCheckpoints = checkpoints.map((cp) => {
      if (cp.id === cpId) {
        return {
          ...cp,
          name: editCpName,
          points: parseInt(editCpPoints, 10) || 0,
          lat: editCpLat,
          lng: editCpLng,
          clue: editCpClue,
        };
      }
      return cp;
    });

    try {
      await updateDoc(cpConfigRef, { checkpointsList: newCheckpoints });
      setEditingCpId(null);
    } catch (e) {
      alert("Failed to save checkpoint");
    }
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
      const teamsRef = collection(db, "artifacts", appId, "public", "data", "races", raceCode, "teams");
      const snapshot = await getDocs(teamsRef);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      const raceRef = doc(db, "artifacts", appId, "public", "data", "races", raceCode);
      await updateDoc(raceRef, {
        teamsList: ["The Anderson Amblers", "The Porteous Patrollers"],
        checkpointsList: DEFAULT_CHECKPOINTS,
      });

      setShowResetInput(false);
      setResetPasswordInput("");
      alert("Race Reset Complete.");
    } catch (err) {
      alert("Reset failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(`omm_admin_${raceCode}`);
      localStorage.removeItem(`omm_team_${raceCode}`);
      await signOut(auth);
      await signInAnonymously(auth);

      setIsAdmin(false);
      setTeamName("");
      // setMyTeamData(null); // No longer needed
      setSelectedIdentity("");
      setPasswordInput("");
      setActiveTab("game");
      setSelectedTeamDetail(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExitRace = () => {
    localStorage.removeItem(`omm_race_${appId}`);
    handleLogout();
    setRaceConfig(null);
    setView("landing");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const exportGpx = (team) => {
    const scans = [...(team.scanHistory || [])].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const attempts = [...(team.attemptLog || [])].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const successWpts = scans.map((scan) => {
      const lat = scan.userLat ?? scan.cpLat;
      const lng = scan.userLng ?? scan.cpLng;
      if (!lat || !lng) return "";
      return `  <wpt lat="${lat}" lon="${lng}">
    <time>${scan.timestamp}</time>
    <name>${scan.name}</name>
    <desc>SUCCESS | ${scan.points} pts | ${scan.method} | ${scan.date || ""} ${scan.time || ""}${scan.userAccuracy ? ` | ±${scan.userAccuracy}m` : ""}</desc>
  </wpt>`;
    }).filter(Boolean);

    const failWpts = attempts.filter(a => a.userLat).map((attempt) => {
      return `  <wpt lat="${attempt.userLat}" lon="${attempt.userLng}">
    <time>${attempt.timestamp}</time>
    <name>FAILED: ${attempt.cpName || attempt.cpId}</name>
    <desc>FAILED | ${attempt.reason} | ${attempt.date || ""} ${attempt.time || ""}${attempt.userAccuracy ? ` | ±${attempt.userAccuracy}m` : ""}</desc>
  </wpt>`;
    });

    const waypoints = [...successWpts, ...failWpts].join("\n");

    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lomond OMM" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${team.name} — ${raceConfig?.raceName || ""} (${raceCode})</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
${waypoints}
</gpx>`;

    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${team.name.replace(/\s+/g, "_")}_${raceCode}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Views ---

  if (loading)
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <MountainIcon className="w-12 h-12 text-emerald-500 animate-bounce" />
      </div>
    );

  // 1. LANDING
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 z-0">
          <img src="background_image.jpg" alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>
        </div>
        <div className="z-10 w-full max-w-sm space-y-8 text-center relative">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl mb-4">
            <CompassIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Lilliesden Maps</h1>

          <div className="space-y-4">
            <button
              onClick={() => setView("join")}
              className="w-full bg-white text-stone-900 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transform transition active:scale-95"
            >
              <NavigationIcon className="w-5 h-5" /> Join Race
            </button>
            <button
              onClick={() => setView("create")}
              className="w-full bg-stone-800 text-stone-400 font-bold py-4 rounded-2xl border border-stone-700 flex items-center justify-center gap-2 transform transition active:scale-95"
            >
              <PlusIcon className="w-5 h-5" /> Set Up New Race
            </button>
          </div>
          <button
            onClick={() => setView("master_login")}
            className="absolute -bottom-24 right-4 p-2 text-stone-500/20 hover:text-stone-500/50 transition z-20"
          >
            <LockIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 1.5 MASTER LOGIN
  if (view === "master_login") {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <button onClick={() => setView("landing")} className="text-stone-400 flex items-center gap-2 text-sm font-bold">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h2 className="text-2xl font-bold text-white text-center">Master Control</h2>
          <form onSubmit={handleMasterLogin} className="space-y-4">
            <input
              type="password"
              className="w-full bg-stone-800 border-stone-700 rounded-xl px-4 py-3 text-white text-center"
              placeholder="Master Password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              autoFocus
            />
            {errorMsg && <div className="text-red-400 text-sm text-center">{errorMsg}</div>}
            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 1.6 MASTER DASHBOARD
  if (view === "master_dashboard") {
    return (
      <div className="min-h-screen bg-stone-900 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setView("landing")} className="text-stone-400 flex items-center gap-2 text-sm font-bold">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h2 className="text-xl font-bold text-white">All Races</h2>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {allRaces.length === 0 ? (
            <div className="text-stone-500 text-center mt-10">No races found.</div>
          ) : (
            allRaces.map((race) => (
              <div key={race.id} className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-lg">{race.id} <span className="text-stone-400 font-normal">({race.raceName})</span></div>
                  <div className="text-stone-500 text-xs mt-1">
                    Created: {race.createdAt ? new Date(race.createdAt.seconds * 1000).toLocaleDateString() : "Unknown"}
                  </div>
                </div>
                <button onClick={() => handleDeleteRace(race.id)} className="bg-red-900/30 text-red-400 p-3 rounded-lg hover:bg-red-900/50 transition">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 2. CREATE RACE
  if (view === "create") {
    return (
      <div className="min-h-screen bg-stone-900 p-6 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full space-y-6">
          <button onClick={() => setView("landing")} className="text-stone-400 flex items-center gap-2 text-sm font-bold">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h2 className="text-3xl font-black text-white">Create Race</h2>
          <form onSubmit={handleCreateRace} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase">Race Name</label>
              <input
                className="w-full bg-stone-800 border-stone-700 rounded-xl px-4 py-3 text-white"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="e.g. Winter Run"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase">Admin Password</label>
              <input
                className="w-full bg-stone-800 border-stone-700 rounded-xl px-4 py-3 text-white"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Secret Pass"
                required
              />
            </div>
            {/* Image inputs... */}
             <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase">
                Background Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "bgUrl")}
                  className="hidden"
                  id="bg-upload"
                />
                <label
                  htmlFor="bg-upload"
                  className="w-full flex items-center gap-3 bg-stone-800 border border-stone-700 border-dashed rounded-xl px-4 py-3 text-stone-400 cursor-pointer hover:bg-stone-800/80 transition"
                >
                  <UploadIcon className="w-4 h-4" />
                  <span className="text-xs truncate">
                    {createForm.bgUrl
                      ? "Image Selected (Tap to change)"
                      : "Tap to upload background"}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase">
                Logo Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logoUrl")}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="w-full flex items-center gap-3 bg-stone-800 border border-stone-700 border-dashed rounded-xl px-4 py-3 text-stone-400 cursor-pointer hover:bg-stone-800/80 transition"
                >
                  <UploadIcon className="w-4 h-4" />
                  <span className="text-xs truncate">
                    {createForm.logoUrl
                      ? "Image Selected (Tap to change)"
                      : "Tap to upload logo"}
                  </span>
                </label>
              </div>
            </div>
            {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl mt-4">
              Create & Launch
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. JOIN RACE
  if (view === "join") {
    return (
      <div className="min-h-screen bg-stone-900 p-6 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full space-y-6 text-center">
          <button onClick={() => setView("landing")} className="text-stone-400 flex items-center gap-2 text-sm font-bold absolute top-6 left-6">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h2 className="text-2xl font-bold text-white">Enter Race Code</h2>
          <input
            className="w-full bg-stone-800 border-stone-700 rounded-2xl px-6 py-6 text-white text-center text-4xl font-mono tracking-widest uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="ABCD"
            maxLength={4}
          />
          {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}
          <button onClick={handleJoinRace} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">
            Enter Race
          </button>
        </div>
      </div>
    );
  }

  // 4. RACE LOGIN
  if (!teamName && !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={raceConfig?.backgroundUrl || "background_image.jpg"} alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>
        </div>

        <div className="z-10 w-full max-w-sm space-y-8 text-center relative">
          <div className="inline-flex p-0 rounded-3xl overflow-hidden relative shadow-2xl mb-4 w-24 h-24">
            <img src={raceConfig?.logoUrl || "image.jpg"} alt="logo" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{raceCode} <span className="text-white/70 text-2xl font-bold">({raceConfig?.raceName})</span></h1>
          </div>
          <form onSubmit={handleIdentityLogin} className="space-y-4 pt-4 bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-white/80 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative">
                <select
                  value={selectedIdentity}
                  onChange={(e) => {
                    setSelectedIdentity(e.target.value);
                    setPasswordInput("");
                    setErrorMsg("");
                  }}
                  className="w-full appearance-none bg-stone-900/80 border border-stone-600 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                >
                  <option value="" disabled>-- Select --</option>
                  <option value="Admin">Admin</option>
                  <optgroup label="Teams">
                    {availableTeams.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
            {selectedIdentity === "Admin" && (
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-stone-900/80 border border-stone-600 text-white px-6 py-4 rounded-2xl"
                placeholder="Password"
              />
            )}
            {errorMsg && <div className="text-red-300 text-sm bg-red-900/40 py-2 rounded-lg border border-red-500/30">{errorMsg}</div>}
            <button type="submit" disabled={!selectedIdentity} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
              {selectedIdentity === "Admin" ? "Login" : "Start"} {selectedIdentity === "Admin" ? <LockIcon className="w-4 h-4" /> : <NavigationIcon className="w-5 h-5" />}
            </button>
          </form>
          <button onClick={handleExitRace} className="text-white/40 text-xs font-bold hover:text-white mt-8">Exit Race</button>
        </div>
      </div>
    );
  }

  // --- 5. RACE APP ---
  return (
    <div className="min-h-screen font-sans max-w-md mx-auto shadow-2xl relative flex flex-col">
      
      {/* BACKGROUND LAYER (FIXED) */}
      <div className="fixed inset-0 z-0">
          <img src={raceConfig?.backgroundUrl || "background_image.jpg"} className="w-full h-full object-cover" alt="bg"/>
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"></div>
      </div>

      {/* CONTENT LAYER (RELATIVE) */}
      <div className="relative z-10 flex flex-col h-full flex-1">
        
        {/* QR Scanner Overlay */}
        {showQrScanner && <QrScanner onScan={handleQrScan} onClose={() => setShowQrScanner(false)} />}
        
        {/* Admin QR Code View Modal */}
        {adminQrModalId && (
          <div className="fixed inset-0 z-50 bg-stone-900/90 flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-stone-800">Print QR Code</h3>
                      <button onClick={() => setAdminQrModalId(null)} className="p-2 bg-stone-100 rounded-full"><CloseIcon className="w-5 h-5 text-stone-500"/></button>
                  </div>
                  <div className="border-4 border-stone-900 p-2 rounded-xl inline-block">
                      <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${adminQrModalId}`} 
                          alt="QR Code"
                          className="w-48 h-48"
                      />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-stone-800">Checkpoint ID:</p>
                      <p className="font-mono text-stone-500">{adminQrModalId}</p>
                  </div>
                  <div className="text-xs text-stone-400">Save this image or print this screen to place at the location.</div>
              </div>
          </div>
        )}

        {/* CLUE VIEWING MODAL (Re-opening a found clue) */}
        {viewingClueCp && (
          <div className="fixed inset-0 z-[60] bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
                  <button onClick={() => setViewingClueCp(null)} className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-stone-200"><CloseIcon className="w-5 h-5 text-stone-500"/></button>
                  
                  <div className="flex flex-col items-center text-center space-y-4 pt-4">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <MessageIcon className="w-8 h-8" />
                      </div>
                      <div>
                          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Message from</div>
                          <h3 className="text-2xl font-black text-stone-800">{viewingClueCp.name}</h3>
                      </div>
                      
                      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 w-full">
                          <p className="text-lg font-medium text-stone-700 italic">
                              "{viewingClueCp.clue || "No message attached to this checkpoint."}"
                          </p>
                      </div>
                      
                      <button onClick={() => setViewingClueCp(null)} className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl mt-4">
                          Close
                      </button>
                  </div>
              </div>
          </div>
        )}

        {selectedTeamDetail && (
          <div className="fixed inset-0 z-50 flex flex-col bg-stone-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-stone-900 text-white p-6 pb-8 rounded-b-3xl shadow-xl relative z-10">
              <button onClick={() => setSelectedTeamDetail(null)} className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                <ArrowLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-black">{selectedTeamDetail.name}</h2>
                <div className="text-stone-400 text-sm font-medium mt-1">Trail Log</div>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
                    <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Points</div>
                    <div className="text-2xl font-black text-emerald-100">{selectedTeamDetail.score}</div>
                  </div>
                  <div className="bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                    <div className="text-xs text-blue-400 uppercase font-bold tracking-wider">Found</div>
                    <div className="text-2xl font-black text-blue-100">{selectedTeamDetail.scanned?.length || 0}</div>
                  </div>
                </div>
                {(selectedTeamDetail.scanHistory?.length > 0 || selectedTeamDetail.attemptLog?.length > 0) && (
                  <button
                    onClick={() => exportGpx(selectedTeamDetail)}
                    className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 mx-auto hover:bg-emerald-700 transition"
                  >
                    <NavigationIcon className="w-3 h-3" /> Export GPX
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!selectedTeamDetail.scanHistory || selectedTeamDetail.scanHistory.length === 0 ? (
                <div className="text-center text-stone-400 mt-10">No checkpoints found yet.</div>
              ) : (
                [...selectedTeamDetail.scanHistory]
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((scan, index, arr) => (
                    <div key={index} className="flex gap-4 relative">
                      {index !== arr.length - 1 && <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-stone-200"></div>}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm"></div>
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-stone-800">{scan.name || "Unknown"}</div>
                            <div className="text-xs text-stone-400 font-mono mt-1">{formatDateTime(scan.timestamp)}</div>
                            {scan.method === "GPS" && <div className="text-[10px] text-blue-400 font-bold uppercase mt-1">GPS Check-in</div>}
                            {scan.method === "QR" && <div className="text-[10px] text-purple-400 font-bold uppercase mt-1">QR Scan</div>}
                            {scan.userLat && <div className="text-[10px] text-stone-400 font-mono mt-0.5">{Number(scan.userLat).toFixed(6)}, {Number(scan.userLng).toFixed(6)}{scan.userAccuracy ? ` ±${scan.userAccuracy}m` : ""}</div>}
                          </div>
                          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">+{scan.points}</div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
              {/* Failed Attempts (admin only) */}
              {isAdmin && selectedTeamDetail.attemptLog?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 px-1">Failed Attempts ({selectedTeamDetail.attemptLog.length})</div>
                  <div className="space-y-2">
                    {[...selectedTeamDetail.attemptLog]
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map((attempt, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-red-400 border-2 border-red-100"></div>
                          <div className="flex-1 bg-red-50 p-3 rounded-xl border border-red-100">
                            <div className="font-bold text-stone-700 text-sm">{attempt.cpName || attempt.cpId}</div>
                            <div className="text-xs text-red-500 mt-0.5">{attempt.reason}</div>
                            <div className="text-xs text-stone-400 font-mono mt-0.5">{attempt.date} {attempt.time}</div>
                            {attempt.userLat && <div className="text-[10px] text-stone-400 font-mono mt-0.5">{Number(attempt.userLat).toFixed(6)}, {Number(attempt.userLng).toFixed(6)}{attempt.userAccuracy ? ` ±${attempt.userAccuracy}m` : ""}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Result Modal with Clue Support */}
        {scanResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-xs p-6 text-center shadow-2xl overflow-y-auto max-h-[80vh]">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  scanResult.status === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                }`}
              >
                {scanResult.status === "success" ? <TrophyIcon className="w-10 h-10" /> : <AlertCircleIcon className="w-10 h-10" />}
              </div>
              
              <h3 className="text-2xl font-black text-stone-800 mb-2">{scanResult.status === "success" ? `+${scanResult.points} pts` : "Alert"}</h3>
              <p className="text-stone-500 font-medium mb-6">{scanResult.message}</p>
              
              {/* Offline sync note */}
              {scanResult.status === "success" && !isOnline && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2">
                  <WifiOffIcon className="w-3 h-3 flex-shrink-0" /> Saved locally — will sync when back online
                </div>
              )}

              {/* Display Clue if present */}
              {scanResult.status === "success" && scanResult.clue && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-left relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">New Clue Unlocked</div>
                      <p className="text-stone-800 font-medium italic text-center">"{scanResult.clue}"</p>
                  </div>
              )}

              <button onClick={() => setScanResult(null)} className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl">
                OK
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md pb-6 pt-4 px-6 rounded-b-[2.5rem] shadow-lg z-10 sticky top-0 border-b border-white/20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{isAdmin ? "Admin Mode" : "Team"}</span>
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">{isAdmin ? "Race Manager" : teamName}</h2>
            </div>
            <div className="flex gap-2 items-center">
              <div className={`px-2 py-1 rounded text-[10px] font-bold ${isOnline ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {isOnline ? <WifiIcon className="w-3 h-3" /> : <WifiOffIcon className="w-3 h-3" />}
              </div>
              <button onClick={handleLogout} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500">
                <LockIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
          {!isAdmin && (
            <div className="bg-stone-900/90 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Score</div>
                  <div className="text-5xl font-black tracking-tighter">{myTeamData?.score || 0}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300">
                  {myTeamData?.scanned?.length || 0} / {checkpoints.length}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-center gap-2 z-20">
            <WifiOffIcon className="w-3 h-3" /> Offline — check-ins are saved locally and will sync when you reconnect
          </div>
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6 space-y-6">
          {activeTab === "game" && !isAdmin && (
            <div className="space-y-4">
              {/* If check-in method is QR, we could show a big scan button at top */}
              {raceConfig?.checkInMethod === 'QR' && (
                  <button 
                    onClick={() => startQrScanner()} 
                    className="w-full bg-stone-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg mb-4 active:scale-95 transition"
                  >
                      <QrCodeIcon className="w-6 h-6"/> SCAN QR CODE
                  </button>
              )}

              {checkpoints.map((cp, idx) => {
                const isScanned = myTeamData?.scanned?.includes(cp.id);
                return (
                  <div key={cp.id} className="relative flex items-center gap-4 py-2">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-sm ${
                        isScanned ? "border-emerald-500 text-emerald-500" : "border-stone-300 text-stone-300"
                      }`}
                    >
                      {isScanned ? <CheckCircleIcon className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div 
                        onClick={() => {
                            if (isScanned) setViewingClueCp(cp);
                        }}
                        className={`flex-1 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center transition-all ${isScanned ? "cursor-pointer hover:bg-stone-50 hover:scale-[1.01]" : ""}`}
                    >
                      <div>
                        <div className="font-bold text-stone-800 text-sm">{cp.name}</div>
                        <div className="text-xs text-stone-400 flex gap-2 mt-1">
                          <span>{cp.points} pts</span>
                          {cp.clue && <span className="text-blue-500 flex items-center gap-0.5"><MessageIcon className="w-3 h-3"/> Msg</span>}
                          {(!cp.lat || !cp.lng) && raceConfig?.checkInMethod === 'GPS' && (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircleIcon className="w-3 h-3" /> No GPS
                            </span>
                          )}
                        </div>
                      </div>
                      {!isScanned && raceConfig?.checkInMethod === 'GPS' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGpsCheckIn(cp.id); }}
                          disabled={gpsLoadingId === cp.id}
                          className="bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                        >
                          {gpsLoadingId === cp.id ? "..." : "Check In"} <GpsIcon className="w-3 h-3" />
                        </button>
                      )}
                      {!isScanned && raceConfig?.checkInMethod === 'QR' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startQrScanner(cp.id); }}
                          className="bg-stone-100 text-stone-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2"
                        >
                          Scan <QrCodeIcon className="w-3 h-3" />
                        </button>
                      )}
                      {/* View Clue Icon for Scanned Items (Visual indicator) */}
                      {isScanned && (
                           <div className="text-blue-400">
                              <EyeIcon className="w-5 h-5"/>
                          </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="space-y-3">
              {teams.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeamDetail(t)}
                  className={`flex items-center p-4 rounded-2xl bg-white border border-stone-100 shadow-sm cursor-pointer active:scale-95 transition-all ${
                    idx < 3 ? "border-l-4 border-l-yellow-400" : ""
                  }`}
                >
                  <div className="w-8 text-center font-bold text-stone-400">{idx + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold text-stone-800">{t.name}</div>
                    <div className="text-xs text-stone-400">{t.scanned?.length || 0} found</div>
                  </div>
                  <div className="font-black text-lg text-stone-900">{t.score}</div>
                </div>
              ))}
            </div>
          )}

          {/* Admin Tabs */}
          {activeTab === "manage" && isAdmin && (
            <div className="space-y-8">
              
              {/* Checkin Method Toggle */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Race Settings</h3>
                  <div className="flex bg-stone-100 p-1 rounded-xl">
                      <button 
                          onClick={() => handleToggleCheckInMethod('GPS')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${raceConfig?.checkInMethod !== 'QR' ? 'bg-white shadow text-stone-800' : 'text-stone-400'}`}
                      >
                          GPS Mode
                      </button>
                      <button 
                          onClick={() => handleToggleCheckInMethod('QR')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${raceConfig?.checkInMethod === 'QR' ? 'bg-white shadow text-stone-800' : 'text-stone-400'}`}
                      >
                          QR Mode
                      </button>
                  </div>
                  <div className="mt-3 text-xs text-stone-500">
                      {raceConfig?.checkInMethod === 'QR' ? "Users must scan QR codes placed at locations." : `Users must be within ${raceConfig?.gpsRadius || GPS_RADIUS_METERS}m of coordinates.`}
                  </div>
                  {raceConfig?.checkInMethod !== 'QR' && (
                    <div className="mt-4">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">GPS Check-in Radius</label>
                      <div className="flex gap-2 mt-2">
                        {[30, 50, 100, 200].map((m) => (
                          <button
                            key={m}
                            onClick={() => handleUpdateGpsRadius(m)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${(raceConfig?.gpsRadius || GPS_RADIUS_METERS) === m ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 px-2 text-white/90 drop-shadow-md">Teams</h3>
                <form onSubmit={handleAddTeam} className="flex gap-2">
                  <input
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3"
                    placeholder="New Team Name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                  <button className="bg-stone-900 text-white p-3 rounded-xl">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </form>
                <div className="space-y-2">
                  {availableTeams.map((name) => (
                    <div key={name} className="bg-white p-4 rounded-xl border border-stone-100 flex justify-between items-center">
                      <span className="font-bold text-stone-700">{name}</span>
                      <button onClick={() => handleDeleteTeam(name)} className="text-stone-300 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-bold text-stone-800 text-white/90 drop-shadow-md">Checkpoints</h3>
                  <button
                    onClick={handleAddCheckpoint}
                    className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition flex items-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" /> Add
                  </button>
                </div>
                {checkpoints.map((cp) => (
                  <div key={cp.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm space-y-3">
                    {editingCpId === cp.id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full border rounded p-2 text-sm"
                          value={editCpName}
                          onChange={(e) => setEditCpName(e.target.value)}
                          placeholder="Name"
                        />
                        <div className="flex gap-2">
                          <input
                            className="w-1/3 border rounded p-2 text-sm"
                            type="number"
                            value={editCpPoints}
                            onChange={(e) => setEditCpPoints(e.target.value)}
                            placeholder="Pts"
                          />
                          <input
                            className="w-1/3 border rounded p-2 text-sm"
                            value={editCpLat}
                            onChange={(e) => setEditCpLat(e.target.value)}
                            placeholder="Lat"
                          />
                          <input
                            className="w-1/3 border rounded p-2 text-sm"
                            value={editCpLng}
                            onChange={(e) => setEditCpLng(e.target.value)}
                            placeholder="Lng"
                          />
                        </div>
                        <textarea
                            className="w-full border rounded p-2 text-sm"
                            value={editCpClue}
                            onChange={(e) => setEditCpClue(e.target.value)}
                            placeholder="Clue / Message (shown after check-in)"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingCpId(null)} className="text-xs font-bold text-stone-500">
                            Cancel
                          </button>
                          <button onClick={() => saveCheckpoint(cp.id)} className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-stone-800 text-sm">{cp.name}</div>
                          <div className="text-xs text-stone-400 flex gap-2 mt-1">
                            <span>{cp.points} pts</span>
                            {cp.clue && <span className="text-blue-500 flex items-center gap-0.5"><MessageIcon className="w-3 h-3"/> Msg</span>}
                            {(!cp.lat || !cp.lng) && raceConfig?.checkInMethod === 'GPS' && (
                              <span className="text-red-400 flex items-center gap-1">
                                <AlertCircleIcon className="w-3 h-3" /> No GPS
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {raceConfig?.checkInMethod === 'QR' && (
                               <button
                               onClick={() => setAdminQrModalId(cp.id)}
                               className="p-2 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200"
                               title="View QR"
                             >
                               <QrCodeIcon className="w-4 h-4" />
                             </button>
                          )}
                          <button onClick={() => startEditingCheckpoint(cp)} className="p-2 bg-stone-50 rounded-lg text-stone-500">
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCheckpoint(cp.id)} className="p-2 bg-red-50 rounded-lg text-red-400">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t-2 border-stone-100 pt-6">
                {!showResetInput ? (
                  <button
                    onClick={() => setShowResetInput(true)}
                    className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <RefreshIcon className="w-5 h-5" /> Reset Application
                  </button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-red-800 font-bold text-sm mb-2 text-center">WARNING: This wipes all data!</div>
                    <form onSubmit={handleFactoryReset} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type 'reset' to confirm"
                        value={resetPasswordInput}
                        onChange={(e) => setResetPasswordInput(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      />
                      <button type="submit" className="bg-red-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-red-700">
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
        </main>

        <div className="fixed bottom-6 left-6 right-6 z-40">
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl flex justify-between max-w-sm mx-auto">
            {!isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab("game")}
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center ${activeTab === "game" ? "bg-stone-900 text-white" : "text-stone-400"}`}
                >
                  <MapIcon className="w-5 h-5 mb-0.5" /> <span className="text-[10px] font-bold">Trail</span>
                </button>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center ${activeTab === "leaderboard" ? "bg-stone-900 text-white" : "text-stone-400"}`}
                >
                  <TrophyIcon className="w-5 h-5 mb-0.5" /> <span className="text-[10px] font-bold">Ranks</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center ${activeTab === "manage" ? "bg-stone-900 text-white" : "text-stone-400"}`}
                >
                  <SettingsIcon className="w-5 h-5 mb-0.5" /> <span className="text-[10px] font-bold">Manage</span>
                </button>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className={`flex-1 py-3 rounded-2xl flex flex-col items-center ${activeTab === "leaderboard" ? "bg-stone-900 text-white" : "text-stone-400"}`}
                >
                  <TrophyIcon className="w-5 h-5 mb-0.5" /> <span className="text-[10px] font-bold">Ranks</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
