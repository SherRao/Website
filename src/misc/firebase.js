import axios from "axios";
import config from "./config.json";

import { initializeApp } from "firebase/app";
import { doc, getFirestore, increment, updateDoc } from "firebase/firestore";

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

const onWebsiteVisit = async () => {
    const response = await axios.get("https://geolocation-db.com/json/");
    const data = response.data;

    const statsRef = doc(db, "website", "stats");
    let updatedData = {};
    updatedData["visits"] = increment(1);
    updatedData[`countries.${data.country_name}`] = increment(1);

    await updateDoc(statsRef, updatedData);
};

export { onWebsiteVisit };
