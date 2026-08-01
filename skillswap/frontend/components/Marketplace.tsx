"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import {
  CITY,
  EDUCATIONTYPE,
  educationTypeToLabel,
  getEventsFromServer,
  getTasksFromServer,
  sendServiceToServer,
  SERVICETAGS,
  SERVICETYPE,
  type Service,
} from "../../backend/DataUtils";

type MarketplaceProps = {
  onLogout: () => void;
};

const EDUCATION_LEVELS = [
  EDUCATIONTYPE.FIRST_YEAR,
  EDUCATIONTYPE.SECOND_YEAR,
  EDUCATIONTYPE.GRADUATE,
] as const;

export default function Marketplace({ onLogout }: MarketplaceProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCity, setActiveCity] = useState("All");
  const [activeServiceType, setActiveServiceType] = useState<
    SERVICETYPE | "All"
  >("All");
  const [activeEducationType, setActiveEducationType] = useState<
    EDUCATIONTYPE | "All"
  >("All");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setIsLoading(true);
      setError(null);

      try {
        const [loadedEvents, loadedTasks] = await Promise.all([
          getEventsFromServer(),
          getTasksFromServer(),
        ]);
        if (!cancelled) setServices([...loadedEvents, ...loadedTasks]);
      } catch {
        if (!cancelled) setError("The marketplace could not be loaded.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const cities = useMemo(
    () => [...new Set(services.map((service) => service.location))].sort(),
    [services],
  );

  const filteredServices = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCity =
        activeCity === "All" || service.location === activeCity;
      const matchesServiceType =
        activeServiceType === "All" || service.type === activeServiceType;
      const matchesEducationType =
        activeEducationType === "All" ||
        service.eduType === activeEducationType;
      const matchesSearch =
        !query ||
        [
          service.title,
          service.description,
          service.author,
          service.location,
          ...service.tags,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesCity &&
        matchesServiceType &&
        matchesEducationType &&
        matchesSearch
      );
    });
  }, [
    activeCity,
    activeEducationType,
    activeServiceType,
    searchValue,
    services,
  ]);

  function resetFilters() {
    setSearchValue("");
    setActiveCity("All");
    setActiveServiceType("All");
    setActiveEducationType("All");
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#workshops" aria-label="SkillSwap home">
          <Image src="/icon.png" alt="SkillSwap" width={50} height={50} />
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
          <label htmlFor="marketplace-search">Search the marketplace</label>
          <input
            id="marketplace-search"
            type="search"
            placeholder="Search skills, hosts, or locations"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        <div className="marketplace-filters" aria-label="Marketplace filters">
          <button
            className={`marketplace-filter-all ${
              activeCity === "All" &&
              activeServiceType === "All" &&
              activeEducationType === "All"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={resetFilters}
            aria-pressed={
              activeCity === "All" &&
              activeServiceType === "All" &&
              activeEducationType === "All"
            }
          >
            All
          </button>

          <label
            className={`marketplace-filter marketplace-filter-city ${activeCity !== "All" ? "active" : ""}`}
          >
            <span>City</span>
            <select
              value={activeCity}
              onChange={(event) => setActiveCity(event.target.value)}
              aria-label="Filter by city"
            >
              <option value="All">All cities</option>
              {cities.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label
            className={`marketplace-filter marketplace-filter-event ${activeServiceType !== "All" ? "active" : ""}`}
          >
            <span>Event</span>
            <select
              value={activeServiceType}
              onChange={(event) =>
                setActiveServiceType(event.target.value as SERVICETYPE | "All")
              }
              aria-label="Filter by service type"
            >
              <option value="All">All types</option>
              <option value={SERVICETYPE.EVENT}>Events</option>
              <option value={SERVICETYPE.TASK}>Tasks</option>
            </select>
          </label>

          <label
            className={`marketplace-filter marketplace-filter-level ${activeEducationType !== "All" ? "active" : ""}`}
          >
            <span>Level</span>
            <select
              value={activeEducationType}
              onChange={(event) =>
                setActiveEducationType(
                  event.target.value === "All"
                    ? "All"
                    : (Number(event.target.value) as EDUCATIONTYPE),
                )
              }
              aria-label="Filter by education level"
            >
              <option value="All">All levels</option>
              {EDUCATION_LEVELS.map((educationType) => (
                <option value={educationType} key={educationType}>
                  {educationTypeToLabel(educationType)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="results-line" aria-live="polite">
          <span>{String(filteredServices.length).padStart(2, "0")} results</span>
          <span>Community listings</span>
        </div>

        {isLoading ? (
          <div className="empty-state" aria-live="polite">
            <span>...</span>
            <h2>LOADING MARKETPLACE</h2>
          </div>
        ) : error ? (
          <div className="empty-state" role="alert">
            <span>!</span>
            <h2>MARKETPLACE UNAVAILABLE</h2>
            <p>{error}</p>
            <button
              type="button"
              className="button button-solid"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        ) : filteredServices.length ? (
          <div className="event-grid">
            {filteredServices.map((service, index) => (
              <EventCard event={service} index={index} key={service.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>00</span>
            <h2>NO LISTINGS FOUND</h2>
            <p>Try a different search term or reset the filters.</p>
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
                    location: formData.get("city") as CITY,
                    address: String(formData.get("location")),
                    description: `${String(formData.get("description"))}\n\n${duration} · ${seats} seats available`,
                    author: "Alex Morgan",
                    type: SERVICETYPE.WORKSHOP,
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
                <span>Address</span>
                <input name="location" type="text" placeholder="e.g. 12 Cuba Street" required />
              </label>

              <label className="share-skill-field">
                <span>City</span>
                <select name="city" defaultValue="" required>
                  <option value="" disabled>Select a city</option>
                  <option value={CITY.AUCKLAND}>Auckland</option>
                  <option value={CITY.HAMILTON}>Hamilton</option>
                  <option value={CITY.CHRISTCHURCH}>Christchurch</option>
                  <option value={CITY.WELLINGTON}>Wellington</option>
                </select>
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
