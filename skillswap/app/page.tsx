"use client";

import Image from "next/image";
import { SVGProps, useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Workshops",
  "Hackathons",
  "Tasks",
];

const EVENTS_DATA = [
  {
    id: 1,
    title: 'Meet&Greet',
    location: "Auckland CBD",
    category: "Workshops", // Matches "Workshops" tab filter
    duration: "2 hrs",
    seats: 30,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=700&fit=crop&auto=format",
    description: "Come along to meet your fellow peers! Network, socialize, and learn about upcoming tech community gatherings."
  },
  {
    id: 2,
    title: 'WDCCxSESA',
    location: "GridAKL",
    category: "Hackathons", // Matches "Hackathons" tab filter
    duration: "18 hrs",
    seats: 80,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=700&fit=crop&auto=format",
    description: "An intensive collaborative building event. Team up, innovate, and hack out real-world software proofs of concept."
  },
  {
    id: 3,
    title: 'HTML&CSS',
    location: "Grey Lynn",
    category: "Workshops", // Matches "Workshops" tab filter
    duration: "3 hrs",
    seats: 25,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=700&fit=crop&auto=format",
    description: "A beginner-friendly practical dive into structural markup basics and modern responsive layout styling workflows."
  },
];

type IconProps = SVGProps<SVGSVGElement>;

function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PeopleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19c.5-3.1 2.4-4.8 5.5-4.8s5 1.7 5.5 4.8M15 14.5c2.9-.4 4.7 1.1 5.2 3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [activeEvent, setActiveEvent] = useState<typeof EVENTS_DATA[0] | null>(null);

  const filteredEvents = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return EVENTS_DATA.filter((event) => {
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
            <p className="eyebrow">Explore the marketplace</p>
            <h1 id="workshops-heading">SKILLS NEAR YOU</h1>
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

        {filteredEvents.length ? (
          <div className="event-grid">
            {filteredEvents.map((workshop, index) => (
              <article className="event-card" key={workshop.id}>
                <div className="card-image">
                  <Image
                    src={workshop.image}
                    alt={`${workshop.title} workshop`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  />
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <button type="button" className="card-arrow" aria-label={`View ${workshop.title}`}>
                    <ArrowIcon />
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-category">
                    {workshop.category} / {workshop.location}
                  </p>
                  <h2>{workshop.title}</h2>
                  <div className="metadata card-metadata">
                    <span><ClockIcon />{workshop.duration}</span>
                    <span><PeopleIcon />{workshop.seats} left</span>
                  </div>
                  <div className="card-footer">
                    <button type="button" className="button button-solid">
                      Register <span>↗</span>
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
            <p>Try a different search term or browse every category.</p>
            <button type="button" className="button button-solid" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Detailed Event Card Overlay Pop-up Modal */}
      {activeEvent && (
        <div 
          onClick={() => setActiveEvent(null)} // Closes pop-up on backdrop shading clicks
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} // Stop overlay close events bubbling up
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
              color: '#333'
            }}
          >
            <button 
              onClick={() => setActiveEvent(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              ✕
            </button>

            <span style={{ 
              display: 'inline-block',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              {activeEvent.category}
            </span>

            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '24px' }}>{activeEvent.title}</h2>
            
            <div style={{ marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
              <p style={{ margin: '6px 0' }}><strong>📍 Location:</strong> {activeEvent.location}</p>
              <p style={{ margin: '6px 0' }}> Duration: {activeEvent.duration}</p>
              <p style={{ margin: '6px 0' }}> Availability: {activeEvent.seats} seats remaining</p>
              <p style={{ marginTop: '16px', color: '#555' }}>{activeEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
