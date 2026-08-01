"use client";

import { useMemo, useState } from "react";
import MockLogin from "./mock-login"; // Keeping your structural imports intact
import EventList from "@/components/EventList";

const CATEGORIES = [
  "All",
  "Workshops",
  "Hackathons",
  "Tasks",
];

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Meet&Greet',
    location: "Auckland CBD",
    category: "Workshops",
    duration: "2 hrs",
    seats: 30,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=700&fit=crop&auto=format",
    description: "Come along to meet your fellow peers! Network, socialize, and learn about upcoming tech community gatherings."
  },
  {
    id: 2,
    title: 'WDCCxSESA',
    location: "GridAKL",
    category: "Hackathons",
    duration: "18 hrs",
    seats: 80,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&h=700&fit=crop&auto=format",
    description: "An intensive collaborative building event. Team up, innovate, and hack out real-world software proofs of concept."
  },
  {
    id: 3,
    title: 'HTML&CSS',
    location: "Grey Lynn",
    category: "Workshops",
    duration: "3 hrs",
    seats: 25,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&h=700&fit=crop&auto=format",
    description: "A beginner-friendly practical dive into structural markup basics and modern responsive layout styling workflows."
  },
];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const filteredEvents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return INITIAL_EVENTS.filter((event) => {
      const matchesCategory = activeCategory === "All" || event.category === activeCategory;
      const matchesSearch =
        !query ||
        [
          event.title,
          event.category,
          event.location,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchValue]);

  function resetFilters() {
    setSearchValue("");
    setActiveCategory("All");
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#workshops" aria-label="SkillSwap home">
          SKILL<span>↔</span>SWAP
        </a>
        <div className="header-actions">
          <MockLogin />
          <button className="button button-solid" type="button">Share a skill</button>
        </div>
      </header>

      <section className="workshop-section marketplace-only" id="workshops" aria-labelledby="workshops-heading">
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

        <div className="category-tabs" role="group" aria-label="Filter by category">
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
