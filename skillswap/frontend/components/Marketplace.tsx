"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import iconImage from "../../app/icon.png";
import creditIcon from "../../app/credit_icon.png";
import graphicImage from "../../app/graphic.png";
import skillsbg from "../../app/skillsbg.png";
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
import { changeCredits, getCredits } from "../../backend/ProfileUtils";

type MarketplaceProps = {
  onLogout: () => void;
};

const CITIES = Object.values(CITY);

const EDUCATION_LEVELS = Object.values(EDUCATIONTYPE).filter(
  (value): value is EDUCATIONTYPE => typeof value === "number",
);

const SERVICE_TYPES = Object.values(SERVICETYPE);
const SERVICE_TAGS = Object.values(SERVICETAGS);

// The mocked signed-in user shown in the nav bar; newly published
// services are credited to this person.
const CURRENT_USER = "M Yang";

function serviceTypeToLabel(serviceType: SERVICETYPE): string {
  return serviceType
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function Marketplace({ onLogout }: MarketplaceProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCity, setActiveCity] = useState<CITY | "All">("All");
  const [activeServiceType, setActiveServiceType] = useState<
    SERVICETYPE | "All"
  >("All");
  const [activeServiceTag, setActiveServiceTag] = useState<
    SERVICETAGS | "All"
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
  // Starts null so the header shows a placeholder until the stored balance loads.
  const [credits, setCredits] = useState<number | null>(null);

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
        if (!cancelled) setError("Events could not be loaded.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;

    getCredits()
      .then((value) => {
        if (!cancelled) setCredits(value);
      })
      .catch(() => {
        // Keep the default balance if the profile cannot be loaded.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isShareFormOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape" && !isPublishing) {
        setIsShareFormOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isPublishing, isShareFormOpen]);

  const filteredServices = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCity =
        activeCity === "All" || service.location === activeCity;
      const matchesServiceType =
        activeServiceType === "All" || service.type === activeServiceType;
      const matchesServiceTag =
        activeServiceTag === "All" || service.tags.includes(activeServiceTag);
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
          service.address,
          service.type,
          ...service.tags,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesCity &&
        matchesServiceType &&
        matchesServiceTag &&
        matchesEducationType &&
        matchesSearch
      );
    });
  }, [
    activeCity,
    activeEducationType,
    activeServiceTag,
    activeServiceType,
    searchValue,
    services,
  ]);

  function resetFilters() {
    setSearchValue("");
    setActiveCity("All");
    setActiveServiceType("All");
    setActiveServiceTag("All");
    setActiveEducationType("All");
  }

  function closeShareForm() {
    if (!isPublishing) {
      setIsShareFormOpen(false);
    }
  }

  async function handleJoin(service: Service): Promise<boolean> {
    if (credits === null || credits < service.credit) {
      return false;
    }

    setCredits(await changeCredits(-service.credit));
    return true;
  }

  return (
    <main className="marketplace-page">
      <header className="site-header">
        <a className="wordmark" href="#workshops" aria-label="SkillSwap home">
          <Image src={iconImage} alt="" width={50} height={50} />
          SKILL<span>↔</span>SWAP
        </a>
        <div className="header-actions">
          <div
            className="mock-credits"
            aria-label={
              credits === null
                ? "Loading credit balance"
                : `Current balance: ${credits.toLocaleString("en-NZ")} credits`
            }
          >
            <strong>
              {credits === null ? "···" : credits.toLocaleString("en-NZ")}
            </strong>
            <Image
              className="credit-icon"
              src={creditIcon}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>
          <div className="mock-account" aria-label={`Signed in as ${CURRENT_USER}`}>
            <div className="mock-account-summary">
              <span className="mock-account-avatar" aria-hidden="true">
                {CURRENT_USER.split(" ").map((part) => part[0]).join("")}
              </span>
              <span className="mock-account-copy">
                <span className="mock-account-label">Signed in</span>
                <strong>{CURRENT_USER}</strong>
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
            Share a service
          </button>
        </div>
      </header>

      <section
        className="workshop-section marketplace-only"
        id="workshops"
        aria-labelledby="workshops-heading"
      >
        <div className="workshop-heading-row">
          <Image
            src={skillsbg}
            alt=""
            className="skillsbg"
            width={1256}
            height={717}
            aria-hidden="true"
          />
          <div className="heading-block">
            <div className="heading-copy">
              <h1 id="workshops-heading">SKILLS NEAR YOU</h1>
              <p className="eyebrow">Explore nearby tech services</p>
            </div>
            <Image
              src={graphicImage}
              className="graphicImage"
              alt=""
              width={320}
              height={220}
              sizes="(max-width: 720px) 30vw, 320px"
              style={{ height: "auto" }}
            />
          </div>
        </div>

        <div className="marketplace-tools">
          <label htmlFor="marketplace-search">Search the platform</label>
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
              activeServiceTag === "All" &&
              activeEducationType === "All"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={resetFilters}
            aria-pressed={
              activeCity === "All" &&
              activeServiceType === "All" &&
              activeServiceTag === "All" &&
              activeEducationType === "All"
            }
          >
            All
          </button>

          <label
            className={`marketplace-filter marketplace-filter-city ${activeCity !== "All" ? "active" : ""}`}
          >
            <select
              value={activeCity}
              onChange={(event) =>
                setActiveCity(event.target.value as CITY | "All")
              }
              aria-label="Filter by city"
            >
              <option value="All">All cities</option>
              {CITIES.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label
            className={`marketplace-filter marketplace-filter-event ${activeServiceType !== "All" ? "active" : ""}`}
          >
            <select
              value={activeServiceType}
              onChange={(event) =>
                setActiveServiceType(event.target.value as SERVICETYPE | "All")
              }
              aria-label="Filter by service type"
            >
              <option value="All">All event types</option>
              {SERVICE_TYPES.map((serviceType) => (
                <option value={serviceType} key={serviceType}>
                  {serviceTypeToLabel(serviceType)}
                </option>
              ))}
            </select>
          </label>

          <label
            className={`marketplace-filter marketplace-filter-category ${activeServiceTag !== "All" ? "active" : ""}`}
          >
            <select
              value={activeServiceTag}
              onChange={(event) =>
                setActiveServiceTag(
                  event.target.value as SERVICETAGS | "All",
                )
              }
              aria-label="Filter by category"
            >
              <option value="All">All categories</option>
              {SERVICE_TAGS.map((serviceTag) => (
                <option value={serviceTag} key={serviceTag}>
                  {serviceTag}
                </option>
              ))}
            </select>
          </label>

          <label
            className={`marketplace-filter marketplace-filter-level ${activeEducationType !== "All" ? "active" : ""}`}
          >
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
          <span>
            {String(filteredServices.length).padStart(2, "0")} results
          </span>
          <span>Community listings</span>
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
        ) : filteredServices.length ? (
          <div className="event-grid">
            {filteredServices.map((service, index) => (
              <EventCard
                event={service}
                index={index}
                key={service.id}
                onJoin={handleJoin}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>00</span>
            <h2>NO LISTINGS FOUND</h2>
            <p>Try a different search term or reset the filters.</p>
            <button
              type="button"
              className="button button-solid"
              onClick={resetFilters}
            >
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
              closeShareForm();
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
                <h2 id="share-skill-heading">CREATE SERVICE</h2>
              </div>
              <button
                className="share-skill-close"
                type="button"
                onClick={closeShareForm}
                aria-label="Close share a skill form"
                disabled={isPublishing}
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
                const scheduledTime = String(formData.get("time"));
                const categories = formData
                  .getAll("category")
                  .map(String) as SERVICETAGS[];

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
                    address: String(formData.get("address")),
                    description: `${String(formData.get("description"))}\n\n${duration} · ${seats} seats available`,
                    author: CURRENT_USER,
                    type: formData.get("serviceType") as SERVICETYPE,
                    credit: Number(formData.get("credit")),
                    tags: categories,
                    time: new Date(scheduledTime).toISOString(),
                    eduType: Number(
                      formData.get("educationType"),
                    ) as EDUCATIONTYPE,
                  });
                  setIsShareFormOpen(false);
                  setReloadKey((key) => key + 1);
                } catch (publishError) {
                  setShareError(
                    publishError instanceof Error
                      ? publishError.message
                      : "Your skill could not be published. Please try again.",
                  );
                } finally {
                  setIsPublishing(false);
                }
              }}
            >
              <label className="share-skill-field share-skill-field-full">
                <span>Title</span>
                <input name="title" type="text" placeholder="e.g. Entry-level front-end programmer needed" required />
              </label>

              <label className="share-skill-field">
                <span>Address</span>
                <input
                  name="address"
                  type="text"
                  placeholder="e.g. 12 Queen Street"
                  required
                />
              </label>

              <label className="share-skill-field">
                <span>City</span>
                <select name="city" defaultValue="" required>
                  <option value="" disabled>
                    Select a city
                  </option>
                  {CITIES.map((city) => (
                    <option value={city} key={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="share-skill-field">
                <span>Category</span>
                <select
                  name="category"
                  multiple
                  size={SERVICE_TAGS.length}
                  required
                >
                  {SERVICE_TAGS.map((tag) => (
                    <option value={tag} key={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <span className="share-skill-hint">
                  Hold Ctrl (Cmd on Mac) to select multiple categories.
                </span>
              </label>

              <label className="share-skill-field">
                <span>Service type</span>
                <select name="serviceType" defaultValue="" required>
                  <option value="" disabled>
                    Select a service type
                  </option>
                  {SERVICE_TYPES.map((serviceType) => (
                    <option value={serviceType} key={serviceType}>
                      {serviceTypeToLabel(serviceType)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="share-skill-field">
                <span>Education level</span>
                <select name="educationType" defaultValue="" required>
                  <option value="" disabled>
                    Select an education level
                  </option>
                  {EDUCATION_LEVELS.map((educationType) => (
                    <option value={educationType} key={educationType}>
                      {educationTypeToLabel(educationType)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="share-skill-field">
                <span>Duration</span>
                <input
                  name="duration"
                  type="text"
                  placeholder="e.g. 2 hours"
                  required
                />
              </label>

              <label className="share-skill-field">
                <span>Seats available</span>
                <input
                  name="seats"
                  type="number"
                  min="1"
                  placeholder="e.g. 12"
                  required
                />
              </label>

              <label className="share-skill-field">
                <span>Date and time</span>
                <input name="time" type="datetime-local" required />
              </label>

              <label className="share-skill-field">
                <span>Credits</span>
                <input
                  name="credit"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue="0"
                  required
                />
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
                <p
                  className="share-skill-error share-skill-field-full"
                  role="alert"
                >
                  {shareError}
                </p>
              )}

              <div className="share-skill-actions share-skill-field-full">
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={closeShareForm}
                  disabled={isPublishing}
                >
                  Cancel
                </button>
                <button
                  className="button button-solid"
                  type="submit"
                  disabled={isPublishing}
                >
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
