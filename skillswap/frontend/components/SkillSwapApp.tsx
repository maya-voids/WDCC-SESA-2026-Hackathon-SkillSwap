"use client";

import { useState } from "react";
import LandingPage from "./LandingPage";
import Marketplace from "./Marketplace";

export default function SkillSwapApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Marketplace onLogout={() => setIsLoggedIn(false)} />;
  }

  return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
}
