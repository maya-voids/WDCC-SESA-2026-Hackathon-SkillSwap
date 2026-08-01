"use client";

import Image from "next/image";
import { SVGProps, useEffect, useMemo, useState } from "react";
import {
  EDUCATIONTYPE,
  getEventsFromServer,
  sendServiceToServer,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "../../backend/DataUtils";

type IconProps = SVGProps<SVGSVGElement>;

function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

type MarketplaceProps = {
  onLogout: () => void;
};

const LOCATION_TAB_COLOURS = [
  "tab-all",
  "tab-age",
  "tab-time",
  "tab-location",
  "tab-skill",
  "tab-iq",
] as const;

export default function Marketplace({ onLogout }: MarketplaceProps) {
  const [events, setEvents] = useState<Service[]>([]);
  const [activeLocation, setActiveLocation] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const loadedEvents = await getEventsFromServer();
        if (!cancelled) setEvents(loadedEvents);
      } catch {
        if (!cancelled) setError("The events could not be loaded.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const locations = useMemo(
    () => ["All", ...new Set(events.map((event) => event.location))],
    [events],
  );

  const filteredEvents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return events.filter((event) => {
      const matchesLocation =
        activeLocation === "All" || event.location === activeLocation;
      const matchesSearch =
        !query ||
        [
          event.title,
          event.description,
          event.author,
          event.location,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesLocation && matchesSearch;
    });
  }, [activeLocation, events, searchValue]);

  function resetFilters() {
    setSearchValue("");
    setActiveLocation("All");
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#workshops" aria-label="SkillSwap home">
                <img src="./icon.png" width="50"/>
          
        </a>
        <div className="header-actions">
          <div className="mock-account" aria-label="Signed in as Alex Morgan">
            <div className="mock-account-summary">
              <span className="mock-account-avatar" aria-hidden="true">AM</span>
              <span className="mock-account-copy">
                <span className="mock-account-label">Signed in</span>
                <strong>Alex Morgan</strong>
              </span>
            </div>
            <button
              className="button button-ghost mock-sign-out"
              type="button"
              onClick={onLogout}
            >
              Sign out
            </button>
          </div>
          <button
            className="button button-solid"
            type="button"
            onClick={() => {
              setShareError(null);
              setIsShareFormOpen(true);
            }}
          >
            Share a skill
          </button>
        </div>
      </header>

      <section
        className="workshop-section marketplace-only"
        id="workshops"
        aria-labelledby="workshops-heading"
      >
        <div className="workshop-heading-row">
          <div>
            <h3 className="eyebrow" >Explore the marketplace</h3>
            <h1 id="workshops-heading">SKILLS NEAR YOU</h1>
          </div>
        </div>

        <div className="marketplace-tools">
          <label htmlFor="marketplace-search">Search events</label>
          <input
            id="marketplace-search"
            type="search"
            placeholder="Search events, hosts, or locations"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <div
          className="category-tabs"
          role="group"
          aria-label="Filter by location"
        >
          {locations.map((location, index) => (
            <button
              key={location}
              className={`${LOCATION_TAB_COLOURS[index % LOCATION_TAB_COLOURS.length]} ${activeLocation === location ? "active" : ""}`.trim()}
              type="button"
              onClick={() => setActiveLocation(location)}
              aria-pressed={activeLocation === location}
            >
              {location}
            </button>
          ))}
        </div>

        <div className="results-line" aria-live="polite">
          <span>{String(filteredEvents.length).padStart(2, "0")} results</span>
          <span>Community events</span>
        </div>

        {isLoading ? (
          <div className="empty-state" aria-live="polite">
            <span>...</span>
            <h2>LOADING EVENTS</h2>
          </div>
        ) : error ? (
          <div className="empty-state" role="alert">
            <span>!</span>
            <h2>EVENTS UNAVAILABLE</h2>
            <p>{error}</p>
            <button
              type="button"
              className="button button-solid"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        ) : filteredEvents.length ? (
          <div className="event-grid">
            {filteredEvents.map((event, index) => (
              <article className="event-card" key={event.id}>
                <div className="card-image">
                  <Image
                    src={event.image}
                    alt={`${event.title} event`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  />
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="card-tag">Event</span>
                  <button type="button" className="card-arrow" aria-label={`View ${event.title}`}>
                    <ArrowIcon />
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-category">
                    {event.type} / {event.location}
                  </p>
                  <h2>{event.title}</h2>
                  <p className="instructor">Hosted by {event.author}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="card-footer">
                    <strong>{event.location}</strong>
                    <button type="button" className="button button-solid">
                      View event <span>↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>00</span>
            <h2>NO EVENTS FOUND</h2>
            <p>Try a different search term or browse every location.</p>
            <button type="button" className="button button-solid" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>

      {isShareFormOpen && (
        <div
          className="share-skill-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsShareFormOpen(false);
            }
          }}
        >
          <section
            className="share-skill-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-skill-heading"
          >
            <header className="share-skill-header">
              <div>
                <p className="eyebrow">Create a listing</p>
                <h2 id="share-skill-heading">Share a skill</h2>
              </div>
              <button
                className="share-skill-close"
                type="button"
                onClick={() => setIsShareFormOpen(false)}
                aria-label="Close share a skill form"
              >
                ×
              </button>
            </header>

            <form
              className="share-skill-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const image = formData.get("image");
                const duration = String(formData.get("duration"));
                const seats = Number(formData.get("seats"));

                if (!(image instanceof File) || image.size === 0) {
                  setShareError("Please select an image for your skill.");
                  return;
                }

                setIsPublishing(true);
                setShareError(null);

                try {
                  await sendServiceToServer({
                    id: crypto.randomUUID(),
                    image,
                    title: String(formData.get("title")),
                    location: String(formData.get("location")),
                    description: `${String(formData.get("description"))}\n\n${duration} · ${seats} seats available`,
                    author: "Alex Morgan",
                    type: SERVICETYPE.EVENT,
                    credit: 0,
                    tags: [String(formData.get("category")) as SERVICETAGS],
                    time: new Date().toISOString(),
                    eduType: EDUCATIONTYPE.FIRST_YEAR,
                  });
                  setIsShareFormOpen(false);
                  setReloadKey((key) => key + 1);
                } catch {
                  setShareError("Your skill could not be published. Please try again.");
                } finally {
                  setIsPublishing(false);
                }
              }}
            >
              <label className="share-skill-field share-skill-field-full">
                <span>Title</span>
                <input name="title" type="text" placeholder="e.g. Beginner pottery wheel" required />
              </label>

              <label className="share-skill-field">
                <span>Location</span>
                <input name="location" type="text" placeholder="e.g. Grey Lynn" required />
              </label>

              <label className="share-skill-field">
                <span>Category</span>
                <select name="category" defaultValue="" required>
                  <option value="" disabled>Select a category</option>
                  <option value={SERVICETAGS.WEB_DEVELOPMENT}>Web development</option>
                  <option value={SERVICETAGS.WEB_DESIGN}>Web design</option>
                  <option value={SERVICETAGS.TYPESCRIPT}>TypeScript</option>
                </select>
              </label>

              <label className="share-skill-field">
                <span>Duration</span>
                <input name="duration" type="text" placeholder="e.g. 2 hours" required />
              </label>

              <label className="share-skill-field">
                <span>Seats available</span>
                <input name="seats" type="number" min="1" placeholder="e.g. 12" required />
              </label>

              <label className="share-skill-field share-skill-field-full">
                <span>Image</span>
                <input name="image" type="file" accept="image/*" required />
              </label>

              <label className="share-skill-field share-skill-field-full">
                <span>Description</span>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Tell people what they will learn and what to bring."
                  required
                />
              </label>

              {shareError && (
                <p className="share-skill-error share-skill-field-full" role="alert">
                  {shareError}
                </p>
              )}

              <div className="share-skill-actions share-skill-field-full">
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => setIsShareFormOpen(false)}
                  disabled={isPublishing}
                >
                  Cancel
                </button>
                <button className="button button-solid" type="submit" disabled={isPublishing}>
                  {isPublishing ? "Publishing…" : "Publish skill"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
