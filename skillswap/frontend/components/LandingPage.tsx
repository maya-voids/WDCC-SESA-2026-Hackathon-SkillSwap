"use client";

import Image from "next/image";
import graphicHome from "../../app/home.png";
import iconImage from "../../app/icon.png";

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
          <Image src={iconImage} alt="SkillSwap" width={50} height={50} />
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
            LEARN TO
            <br />
            <span>MAKE</span>
            <br />
            FOR REAL
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
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
