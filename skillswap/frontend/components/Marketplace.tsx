"use client";

import Image from "next/image";
import { SVGProps, useEffect, useMemo, useState } from "react";
import {
  getEventsFromServer,
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

export default function Marketplace() {
  const [events, setEvents] = useState<Service[]>([]);
  const [activeLocation, setActiveLocation] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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
          SKILL<span>↔</span>SWAP
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#workshops">Discover</a>
          <a href="#workshops">How it works</a>
          <a href="#workshops">Teach</a>
          <a href="#workshops">About</a>
        </nav>
        <div className="header-actions">
          <button className="button button-ghost" type="button">
            Log in
          </button>
          <button className="button button-solid" type="button">
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
            <p className="eyebrow">Explore the community</p>
            <h1 id="workshops-heading">CAMPUS EVENTS</h1>
          </div>
          <button className="text-button" type="button" onClick={resetFilters}>
            View all <span>↗</span>
          </button>
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

        <div className="category-tabs" role="group" aria-label="Filter by location">
          {locations.map((location) => (
            <button
              key={location}
              className={activeLocation === location ? "active" : ""}
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
          <div className="workshop-grid">
            {filteredEvents.map((event, index) => (
              <article className="workshop-card" key={event.id}>
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
    </main>
  );
}
