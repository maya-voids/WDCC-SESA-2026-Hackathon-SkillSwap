"use client";

import { useState } from "react";

const MOCK_USER = {
  name: "Alex Morgan",
  initials: "AM",
};

export default function MockLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <button
        className="button button-ghost"
        type="button"
        onClick={() => setIsLoggedIn(true)}
      >
        Log in
      </button>
    );
  }

  return (
    <div className="mock-account" aria-live="polite">
      <div className="mock-account-summary" title={`Signed in as ${MOCK_USER.name}`}>
        <span className="mock-account-avatar" aria-hidden="true">
          {MOCK_USER.initials}
        </span>
        <span className="mock-account-copy">
          <span className="mock-account-label">Mock account</span>
          <strong>{MOCK_USER.name}</strong>
        </span>
      </div>
      <button
        className="button button-ghost mock-sign-out"
        type="button"
        onClick={() => setIsLoggedIn(false)}
      >
        Sign out
      </button>
    </div>
  );
}
