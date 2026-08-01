"use client";

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
      <article 
        className="workshop-card" 
        onClick={() => setIsOpen(true)} 
        style={{ cursor: "pointer" }}
      >
        <div className="card-image" style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
          <img
            src={event.image}
            alt={`${event.title} workshop`}
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
          <p className="card-category" style={{color: 'white'}}>
            {event.category} / {event.location}
          </p>
          <h2 style={{color: 'white'}}>{event.title}</h2>
          <div className="metadata card-metadata">
            <span style={{color: 'white'}}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              {event.duration}
            </span>
            <span style={{color: 'white'}}>
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


      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="workshop-section"
            style={{
              backgroundColor: '#fff',
              padding: '40px',
              borderRadius: '0px',
              border: '2px solid #000', 
              width: '90%',
              maxWidth: '600px',
              boxShadow: '10px 10px 0px #000', 
              position: 'relative',
            }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="card-arrow"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                transform: 'rotate(45deg)' 
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>

            <div className="workshop-heading-row" style={{ marginBottom: '24px', display: 'block' }}>
              <p className="eyebrow">{event.category} / {event.location}</p>
              <h1 style={{ fontSize: '32px', margin: '8px 0 0 0', textTransform: 'uppercase' }}>
                {event.title}
              </h1>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #000' }}>
              <img
                src={event.image}
                alt={`${event.title} preview`}
                sizes="(max-width: 700px) 90vw, 520px"
              />
            </div>

            <div style={{ marginBottom: '32px', lineHeight: '1.6' }}>
              <p style={{ color: '#000', fontSize: '16px' }}>{event.description}</p>
            </div>

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
