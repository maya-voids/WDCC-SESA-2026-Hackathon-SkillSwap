"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { type Service } from "../backend/DataUtils";
import EventModal, { formatEventTime } from "./EventModal";

interface EventCardProps {
  event: Service;
  index: number;
  /**
   * Called when the user confirms participation; the marketplace spends/earns
   * credits. Returns true when the join succeeded, or false when the user has
   * too few credits.
   */
  onJoin?: (event: Service) => Promise<boolean> | boolean;
  /**
   * Called with the join outcome right before the modal closes, so the parent
   * can show the confirmation popup.
   */
  onJoinResult?: (success: boolean) => void;
}

export default function EventCard({
  event,
  index,
  onJoin,
  onJoinResult,
}: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const eventTime = formatEventTime(event.time);
  const skillLabel = event.tags.join(" / ");
  const listingLabel = event.type
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <>
      <article
        className="event-card"
        data-type={event.type}
        style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
      >
        <div
          className="card-image"
          onClick={() => setIsOpen(true)}
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === "Enter" || keyEvent.key === " ") {
              keyEvent.preventDefault();
              setIsOpen(true);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${listingLabel.toLowerCase()} details for ${event.title}`}
        >
          <Image
            src={event.image}
            alt={`${event.title} ${listingLabel.toLowerCase()}`}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 25vw"
          />
          <span className="card-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="card-tag">{listingLabel}</span>
          <span className="card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path
                d="M5 19 19 5M9 5h10v10"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </span>
        </div>

        <div className="card-body">
          <p className="card-category">{skillLabel}</p>
          <h2>{event.title}</h2>
          <p className="instructor">Hosted by {event.author}</p>
          <p className="event-description">{event.description}</p>
          <div className="metadata card-metadata">
            <span>{eventTime}</span>
            <span>{event.credit} credits</span>
          </div>
          <div className="card-footer">
            <strong>{event.location}</strong>
            <button
              type="button"
              className="button button-solid"
              onClick={() => setIsOpen(true)}
            >
              View {listingLabel.toLowerCase()} <span>↗</span>
            </button>
          </div>
        </div>
      </article>

      <EventModal
        event={event}
        open={isOpen}
        onClose={handleClose}
        onJoin={onJoin}
        onJoinResult={onJoinResult}
      />
    </>
  );
}
