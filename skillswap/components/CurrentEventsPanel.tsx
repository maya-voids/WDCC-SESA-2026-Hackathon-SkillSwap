"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { type Service } from "../backend/DataUtils";
import EventModal, { formatEventTime } from "./EventModal";

interface CurrentEventsPanelProps {
  events: Service[];
  open: boolean;
  onClose: () => void;
  /** Called when the user removes an event from the list; the marketplace hides
   * it from the main grid until it is re-joined. */
  onRemove: (event: Service) => void;
}

/**
 * Left-hand drawer listing every event the user has confirmed participation in,
 * ordered soonest-first by event time. Always mounted so the slide transition
 * animates both directions; the collapse arrow on the right edge of the header
 * closes it. Clicking a title opens the shared event-detail modal in view-only
 * mode (no confirm button — the event is already joined). Each row has a remove
 * button underneath that returns the event to the main grid.
 */
export default function CurrentEventsPanel({
  events,
  open,
  onClose,
  onRemove,
}: CurrentEventsPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<Service | null>(null);
  const closeModal = useCallback(() => setSelectedEvent(null), []);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
    [events],
  );

  return (
    <>
      <aside
        className={`current-events-panel${open ? " open" : ""}`}
        aria-hidden={!open}
        aria-label="My events"
      >
        <header className="current-events-header">
          <strong>MY EVENTS</strong>
          <span className="current-events-count">
            {String(events.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="current-events-collapse"
            onClick={onClose}
            aria-label="Collapse events list"
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path
                d="M15 5 8 12l7 7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </header>

        {sortedEvents.length === 0 ? (
          <p className="current-events-empty">
            No events yet. Confirm participation on a service to see it here.
          </p>
        ) : (
          <ul className="current-events-list">
            {sortedEvents.map((event) => (
              <li className="current-events-item" key={event.id}>
                <div className="current-events-thumb">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="48px"
                  />
                </div>
                <div className="current-events-copy">
                  <button
                    type="button"
                    className="current-events-title"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.title}
                  </button>
                  <span className="current-events-time">
                    {formatEventTime(event.time)}
                  </span>
                  <button
                    type="button"
                    className="current-events-remove"
                    onClick={() => onRemove(event)}
                  >
                    remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {selectedEvent && (
        <EventModal event={selectedEvent} open onClose={closeModal} />
      )}
    </>
  );
}
