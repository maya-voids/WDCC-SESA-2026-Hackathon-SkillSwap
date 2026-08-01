"use client";

import { useMemo, useState } from "react";
import EventList from "@/components/EventList";
import type { EventData } from "@/components/EventCard";
import mockEvents from "../../backend/mockdata.json";

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
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);
  const [submittedSkills, setSubmittedSkills] = useState<EventData[]>([]);

  const filteredEvents = useMemo(() => {
    const marketplaceEvents = [...submittedSkills, ...MOCK_EVENTS];
    const query = searchValue.trim().toLowerCase();

    return marketplaceEvents.filter((event) => {
      const matchesCategory =
        activeCategory === "All" || event.category === activeCategory;
      const matchesSearch =
        !query ||
        [event.title, event.category, event.location].some((value) =>
          value.toLowerCase().includes(query),
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchValue, submittedSkills]);

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
            onClick={() => setIsShareFormOpen(true)}
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
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const image = formData.get("image");

                setSubmittedSkills((currentSkills) => [
                  {
                    id: Date.now(),
                    title: String(formData.get("title")),
                    location: String(formData.get("location")),
                    category: String(formData.get("category")),
                    duration: String(formData.get("duration")),
                    seats: Number(formData.get("seats")),
                    image:
                      image instanceof File && image.size > 0
                        ? URL.createObjectURL(image)
                        : "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&h=700&fit=crop&auto=format",
                    description: String(formData.get("description")),
                  },
                  ...currentSkills,
                ]);
                setIsShareFormOpen(false);
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
                  <option value="Workshops">Workshop</option>
                  <option value="Hackathons">Hackathon</option>
                  <option value="Tasks">Task</option>
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

              <div className="share-skill-actions share-skill-field-full">
                <button className="button button-ghost" type="button" onClick={() => setIsShareFormOpen(false)}>
                  Cancel
                </button>
                <button className="button button-solid" type="submit">
                  Publish skill
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
