"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { educationTypeToLabel, type Service } from "../backend/DataUtils";

interface EventCardProps {
  event: Service;
  index: number;
}

function formatEventTime(time: string): string {
  const date = new Date(time);

  if (Number.isNaN(date.getTime())) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EventCard({ event, index }: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const eventTime = formatEventTime(event.time);
  const educationLevel = educationTypeToLabel(event.eduType);
  const skillLabel = event.tags.join(" / ");
  const listingLabel = event.type
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <article className="event-card">
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
          <p className="card-category">
            {skillLabel} / {event.location}
          </p>
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

      {isOpen && (
        <div
          className="event-modal-overlay"
          onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              <button
                type="button"
                className="button button-solid"
                onClick={() => {
                  alert(`Successfully joined ${event.title}!`);
                  setIsOpen(false);
                }}
              >
                Confirm participation{" "}
                <span>↗</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
