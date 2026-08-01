"use client";

import { useMemo, useState } from "react";
import EventList from "@/components/EventList";
import type { EventData } from "@/components/EventCard";
import mockEvents from "../../backend/mockdata.json";

const CATEGORIES = ["All", "Workshops", "Hackathons", "Tasks"];

const MOCK_EVENTS: EventData[] = mockEvents;

type MarketplaceProps = {
  onLogout: () => void;
};

export default function Marketplace({ onLogout }: MarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const filteredEvents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return MOCK_EVENTS.filter((event) => {
      const matchesCategory =
        activeCategory === "All" || event.category === activeCategory;
      const matchesSearch =
        !query ||
        [event.title, event.category, event.location].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchValue]);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#workshops" aria-label="SkillSwap home">
          SKILL<span>↔</span>SWAP
        </a>
        <div className="header-actions">
          <button className="button button-solid" type="button">Share a skill</button>
        </div>
      </header>

      <section
        className="workshop-section marketplace-only"
        id="workshops"
        aria-labelledby="workshops-heading"
      >
        <div className="workshop-heading-row">
          <div>
            <p className="eyebrow">Explore the marketplace</p>
            <h1 id="workshops-heading">EVENTS NEAR YOU</h1>
          </div>
        </div>

        <div className="marketplace-tools">
          <label htmlFor="marketplace-search">Search the marketplace</label>
          <input
            id="marketplace-search"
            type="search"
            placeholder="Search skills, hosts, or locations"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <div
          className="category-tabs"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="results-line" aria-live="polite">
          <span>{String(filteredEvents.length).padStart(2, "0")} results</span>
        </div>
        <EventList events={filteredEvents} />
      </section>
    </main>
  );
}
