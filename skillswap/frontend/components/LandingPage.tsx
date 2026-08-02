"use client";

import Image from "next/image";
import iconImage from "../../app/icon.png";
import graphicHome from "../../app/home.png";
import internships101 from "../../app/internships101.png";
import sam from "../../app/sam.png";

type LandingPageProps = {
  onLogin: () => void;
};

const STATS = [
  { value: "120+", label: "Workshops listed" },
  { value: "1.2K", label: "Local learners" },
  { value: "06", label: "Skill categories" },
  { value: "4.9", label: "Average rating" },
];

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <main className="landing-page">
      <header className="landing-topbar">
        <a className="wordmark" href="#top" aria-label="SkillSwap home">
          <Image src={iconImage} alt="" width={50} height={50} />
          SKILL<span>↔</span>SWAP
        </a>
        <p>Your local tech discovery platform</p>
        <div className="landing-topbar-actions">
          <button className="button button-ghost" type="button" onClick={onLogin}>
            EXPLORE
          </button>
          <button className="button button-solid" type="button" onClick={onLogin}>
            Log in
          </button>
        </div>
      </header>

      <section
        className="landing-hero"
        id="top"
        aria-labelledby="landing-heading"
      >
        <div
          className="landing-hero-copy"
          style={{ backgroundImage: `url("${internships101.src}")` }}
        >
          <p className="landing-kicker">Student Tech Discovery & Connection platform</p>
          <h1 id="landing-heading">
            learn to 
            <br />
            <span>make</span>
            <br />
            for real
          </h1>
          <Image
            src={graphicHome}
            className="landing-home-graphic"
            alt=""
            width={720}
            height={280}
          />
        </div>
        <div
          className="landing-stat-grid"
          aria-label="SkillSwap community statistics"
        >
          {STATS.map((stat) => (
            <div className="landing-stat" key={stat.label}>
              {stat.label === "Local learners" && (
                <Image
                  src={sam}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 50vw, 25vw"
                  className="landing-stat-image"
                />
              )}
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
