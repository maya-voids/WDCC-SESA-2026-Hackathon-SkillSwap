"use client";

import Image from "next/image";
import { useState } from 'react';

export interface EventData {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  seats: number;
  image: string;
  description: string;
}

interface EventCardProps {
  event: EventData;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* 1. Main Marketplace Event Card Design */}
      <article 
        className="workshop-card" 
        onClick={() => setIsOpen(true)} 
        style={{ cursor: "pointer" }}
      >
        <div className="card-image" style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
          <Image
            src={event.image}
            alt={`${event.title} workshop`}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
          <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
          <button type="button" className="card-arrow" aria-label={`View ${event.title}`}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
        
        <div className="card-body">
          <p className="card-category">
            {event.category} / {event.location}
          </p>
          <h2>{event.title}</h2>
          <div className="metadata card-metadata">
            <span>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              {event.duration}
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M3.5 19c.5-3.1 2.4-4.8 5.5-4.8s5 1.7 5.5 4.8M15 14.5c2.9-.4 4.7 1.1 5.2 3.5" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              {event.seats} left
            </span>
          </div>
          <div className="card-footer">
            <button type="button" className="button button-solid">
              Register <span>↗</span>
            </button>
          </div>
        </div>
      </article>

      {/* 2. Redesigned Modifying Modal Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Muted, clean dimming backdrop
            backdropFilter: 'blur(4px)', // Optional: modern premium layout blurring
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          {/* Main Container leveraging your page's structural section blocks */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="workshop-section"
            style={{
              backgroundColor: '#fff',
              padding: '40px',
              borderRadius: '0px', // Matches the sharp architectural style of the header tabs
              border: '2px solid #000', // Matches clean line styling design aesthetics
              width: '90%',
              maxWidth: '600px',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              boxShadow: '10px 10px 0px #000', // Sharp brut-minimalist shadow offset 
              position: 'relative',
            }}
          >
            {/* Native Close Button Trigger matching card-arrow styles */}
            <button 
              onClick={() => setIsOpen(false)}
              className="card-arrow"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                transform: 'rotate(45deg)' // Simple transform trick to make your arrow turn into a close sign
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>

            {/* Modal Content Structure aligned with Marketplace typography */}
            <div className="workshop-heading-row" style={{ marginBottom: '24px', display: 'block' }}>
              <p className="eyebrow">{event.category} / {event.location}</p>
              <h1 style={{ fontSize: '32px', margin: '8px 0 0 0', textTransform: 'uppercase' }}>
                {event.title}
              </h1>
            </div>

            {/* Visual Hero Area matching your card layouts */}
            <div className="event-modal-image">
              <Image
                src={event.image}
                alt={`${event.title} preview`}
                fill
                sizes="(max-width: 700px) 90vw, 520px"
              />
            </div>

            {/* Description Text matching global styling typography */}
            <div style={{ marginBottom: '32px', lineHeight: '1.6' }}>
              <p style={{ color: '#000', fontSize: '16px' }}>{event.description}</p>
            </div>

            {/* Combined Footer & Meta Row matching the lower card bodies */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <div className="metadata card-metadata" style={{ margin: 0 }}>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  {event.duration}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="17" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M3.5 19c.5-3.1 2.4-4.8 5.5-4.8s5 1.7 5.5 4.8M15 14.5c2.9-.4 4.7 1.1 5.2 3.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  {event.seats} left
                </span>
              </div>

              <button 
                type="button" 
                className="button button-solid"
                onClick={() => {
                  alert(`Successfully registered for ${event.title}!`);
                  setIsOpen(false);
                }}
              >
                Confirm Registration <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
