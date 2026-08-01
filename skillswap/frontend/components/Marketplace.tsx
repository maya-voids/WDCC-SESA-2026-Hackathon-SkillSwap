"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import EventList from "@/components/EventList";
import type { EventData } from "@/components/EventCard";
import mockEvents from "../../backend/mockdata.json";
import iconImage from "../../app/icon.png";
import graphicImage from "../../app/graphic.png";

const CATEGORIES = [
  { label: "All", color: "tab-all" },
  { label: "Age", color: "tab-age" },
  { label: "Time/Date", color: "tab-time" },
  { label: "Location", color: "tab-location" },
  { label: "Skill Level", color: "tab-skill" },
  { label: "IQ Amount", color: "tab-iq" },
];

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
          <Image src={iconImage} alt="SkillSwap icon" width={50} height={50} />
        </a>
        <div className="header-actions">
          <div className="mock-credits" aria-label="^& Credits"><p>1000 ✦</p></div>
          
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
          <div className="heading-block">
            <div className="heading-copy">
              <h3 className="eyebrow">Explore the marketplace</h3>
              <h1 style={{ color: "var(--orange)" }}>SKILLS NEAR YOU</h1>
            </div>
            <Image src={graphicImage} className="graphicImage" alt="SkillSwap marketplace graphic" width={320} height={220} />
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
              key={category.label}
              className={`${category.color} ${activeCategory === category.label ? "active" : ""}`.trim()}
              type="button"
              onClick={() => setActiveCategory(category.label)}
              aria-pressed={activeCategory === category.label}
            >
              {category.label}
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
