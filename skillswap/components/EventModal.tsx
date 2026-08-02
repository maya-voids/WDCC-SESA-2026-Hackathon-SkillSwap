"use client";

import Image from "next/image";
import { useEffect } from "react";
import { educationTypeToLabel, type Service } from "../backend/DataUtils";

interface EventModalProps {
  event: Service;
  open: boolean;
  onClose: () => void;
  /**
   * Called when the user confirms participation; the marketplace spends/earns
   * credits. Returns true when the join succeeded, or false when the user has
   * too few credits. When omitted the modal is view-only (no button) — used by
   * the current events drawer for events the user has already joined.
   */
  onJoin?: (event: Service) => Promise<boolean> | boolean;
  /**
   * Called with the join outcome right before the modal closes, so the parent
   * can show the confirmation popup in place of the removed browser alert().
   */
  onJoinResult?: (success: boolean) => void;
}

/** Format an event's stored UTC time for display, e.g. "22 Aug 2026, 9:00 am". */
export function formatEventTime(time: string): string {
  const date = new Date(time);

  if (Number.isNaN(date.getTime())) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EventModal({
  event,
  open,
  onClose,
  onJoin,
  onJoinResult,
}: EventModalProps) {
  const eventTime = formatEventTime(event.time);
  const educationLevel = educationTypeToLabel(event.eduType);
  const skillLabel = event.tags.join(" / ");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="event-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="event-modal-dialog"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`event-dialog-title-${event.id}`}
      >
        <button
          type="button"
          className="event-modal-close"
          onClick={onClose}
          aria-label="Close event details"
        >
          ×
        </button>

        <header className="event-modal-heading">
          <p className="eyebrow">
            {skillLabel} / {event.location}
          </p>
          <h2 id={`event-dialog-title-${event.id}`}>{event.title}</h2>
        </header>

        <div className="event-modal-image">
          <Image
            src={event.image}
            alt={`${event.title} preview`}
            fill
            sizes="(max-width: 700px) 90vw, 520px"
          />
        </div>

        <div className="event-modal-description">
          <p>{event.description}</p>
          <p className="instructor">Hosted by {event.author}</p>
        </div>

        <div className="event-modal-footer">
          <div className="metadata card-metadata">
            <span>{eventTime}</span>
            <span>{event.credit} credits</span>
            <span>{educationLevel}</span>
          </div>
          {onJoin && (
            <button
              type="button"
              className="button button-solid"
              onClick={async () => {
                const joined = (await onJoin(event)) ?? true;
                // The browser alert() is gone; the parent shows the stylised
                // confirmation popup via onJoinResult instead.
                onJoinResult?.(joined);
                onClose();
              }}
            >
              Confirm participation <span>↗</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
