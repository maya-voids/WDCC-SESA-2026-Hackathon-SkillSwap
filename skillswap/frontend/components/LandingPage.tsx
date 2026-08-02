"use client";

import Image from "next/image";
import graphicHome from "../../app/home.png";

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
          SKILL<span>↔</span>SWAP
        </a>
        <p>The local skills marketplace</p>
        <button className="button button-solid" type="button" onClick={onLogin}>
          Log in
        </button>
      </header>

      <section
        className="landing-hero"
        id="top"
        aria-labelledby="landing-heading"
      >
        <div className="landing-hero-copy">
          <p className="landing-kicker">Student Tech Discovery & Connection platform</p>
          <h1 id="landing-heading">
            learn to 
            <br />
            <span>make</span>
            <br />
            for real
          </h1>
          <p className="landing-intro">
           Find physical tech events and student connections with no distractions
          </p>
        </div>
        <Image
          src={graphicHome}
          className="landing-home-graphic"
          alt="SkillSwap home graphic"
          width={720}
          height={280}
        />
        <div
          className="landing-stat-grid"
          aria-label="SkillSwap community statistics"
        >
          {STATS.map((stat) => (
            <div className="landing-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
