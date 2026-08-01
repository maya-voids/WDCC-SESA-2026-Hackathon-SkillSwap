"use client";

import Image from "next/image";
import { SVGProps, useMemo, useState } from "react";
import MockLogin from "./mock-login";

const CATEGORIES = [
  { label: "All", color: "tab-all" },
  { label: "Age", color: "tab-age" },
  { label: "Time/Date", color: "tab-time" },
  { label: "Location", color: "tab-location" },
  { label: "Skill Level", color: "tab-skill" },
  { label: "IQ Amount", color: "tab-iq" },
];

const WORKSHOPS = [
  {
    id: 1,
    title: "Wheel-thrown pottery fundamentals",
    instructor: "Marta Kovacs",
    location: "Auckland CBD",
    category: "Ceramics",
    price: 120,
    duration: "3 hrs",
    seats: 8,
    rating: 4.9,
    reviews: 214,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&h=700&fit=crop&auto=format",
    tag: "Bestseller",
  },
  {
    id: 2,
    title: "Japanese joinery: mortise & tenon",
    instructor: "Kenji Watanabe",
    location: "Mt Eden",
    category: "Woodworking",
    price: 195,
    duration: "6 hrs",
    seats: 5,
    rating: 5.0,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&h=700&fit=crop&auto=format",
    tag: "New",
  },
  {
    id: 3,
    title: "Hand-stitched leather wallet",
    instructor: "Elena Russo",
    location: "Grey Lynn",
    category: "Leatherwork",
    price: 85,
    duration: "4 hrs",
    seats: 10,
    rating: 4.8,
    reviews: 162,
    image:
      "https://images.unsplash.com/photo-1620287062871-0ea02b6c7a2d?w=900&h=700&fit=crop&auto=format",
    tag: null,
  },
  {
    id: 4,
    title: "Forge your own chef’s knife",
    instructor: "Anders Holm",
    location: "Onehunga",
    category: "Metalwork",
    price: 275,
    duration: "8 hrs",
    seats: 4,
    rating: 4.9,
    reviews: 53,
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=900&h=700&fit=crop&auto=format",
    tag: "Popular",
  },
  {
    id: 5,
    title: "Tool fundamentals: build a toolbox",
    instructor: "Sam Diaz",
    location: "Kingsland",
    category: "Woodworking",
    price: 65,
    duration: "2 hrs",
    seats: 12,
    rating: 4.7,
    reviews: 309,
    image:
      "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=900&h=700&fit=crop&auto=format",
    tag: null,
  },
  {
    id: 6,
    title: "Natural dyeing and woven colour",
    instructor: "Aroha Te Rangi",
    location: "Ponsonby",
    category: "Textiles",
    price: 150,
    duration: "5 hrs",
    seats: 6,
    rating: 4.8,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=900&h=700&fit=crop&auto=format",
    tag: "Limited",
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

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const filteredWorkshops = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return WORKSHOPS.filter((workshop) => {
      const matchesCategory =
        activeCategory === "All" || workshop.category === activeCategory;
      const matchesSearch =
        !query ||
        [
          workshop.title,
          workshop.instructor,
          workshop.category,
          workshop.location,
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
                <img src="./icon.png" width="50"/>
          
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#workshops">Discover</a>
          <a href="#workshops">How it works</a>
          <a href="#workshops">Teach</a>
          <a href="#workshops">About</a>
        </nav>
        <div className="header-actions">
          <MockLogin />
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
            <h3 className="eyebrow" >Explore the marketplace</h3>
            <h1 id="workshops-heading">SKILLS NEAR YOU</h1>
          </div>
          <button className="text-button" type="button" onClick={resetFilters}>
            View all <span>↗</span>
          </button>
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
          <span>{String(filteredWorkshops.length).padStart(2, "0")} results</span>
          <span>Sorted by recommended</span>
        </div>

        {filteredWorkshops.length ? (
          <div className="workshop-grid">
            {filteredWorkshops.map((workshop, index) => (
              <article className="workshop-card" key={workshop.id}>
                <div className="card-image">
                  <Image
                    src={workshop.image}
                    alt={`${workshop.title} workshop`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  />
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  {workshop.tag && <span className="card-tag">{workshop.tag}</span>}
                  <button type="button" className="card-arrow" aria-label={`View ${workshop.title}`}>
                    <ArrowIcon />
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-category">
                    {workshop.category} / {workshop.location}
                  </p>
                  <h2>{workshop.title}</h2>
                  <p className="instructor">with {workshop.instructor}</p>
                  <div className="metadata card-metadata">
                    <span><ClockIcon />{workshop.duration}</span>
                    <span><PeopleIcon />{workshop.seats} left</span>
                    <span>★ {workshop.rating} ({workshop.reviews})</span>
                  </div>
                  <div className="card-footer">
                    <strong>${workshop.price}</strong>
                    <button type="button" className="button button-solid">
                      Book <span>↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>00</span>
            <h2>NO SKILLS FOUND</h2>
            <p>Try a different search term or browse every category.</p>
            <button type="button" className="button button-solid" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
