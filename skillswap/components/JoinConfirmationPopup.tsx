"use client";

import { useEffect } from "react";

interface JoinConfirmationPopupProps {
  /** Whether the join succeeded (event added) or failed (no credits). */
  success: boolean;
  onClose: () => void;
}

/**
 * Stylised confirmation window shown after the user confirms participation,
 * replacing the browser alert(). Auto-dismisses, but stays on screen long
 * enough to read even if the event modal closes behind it.
 */
export default function JoinConfirmationPopup({
  success,
  onClose,
}: JoinConfirmationPopupProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="join-popup-overlay"
      onClick={onClose}
      role="presentation"
    >
      <section
        className={`join-popup ${success ? "join-popup-success" : "join-popup-error"}`}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        role="dialog"
        aria-modal="false"
        aria-live="polite"
        aria-labelledby="join-popup-title"
      >
        <button
          type="button"
          className="join-popup-close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          ×
        </button>

        <div className="join-popup-icon" aria-hidden="true">
          {success ? (
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span>!</span>
          )}
        </div>

        <p className="eyebrow join-popup-eyebrow">
          {success ? "List updated" : "Not enough credits"}
        </p>
        <h2 id="join-popup-title">
          {success
            ? "Event successfully added to list!"
            : "You don't have enough credits to join this skill."}
        </h2>
      </section>
    </div>
  );
}
