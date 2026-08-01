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
      {/* 1. Main Marketplace Event Card Design */}
      <article 
        className="workshop-card" 
        onClick={() => setIsOpen(true)} 
        style={{ cursor: "pointer" }}
      >
        <div className="card-image">
          <img src={event.image} alt={`${event.title} workshop`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ marginRight: '4px' }}>
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              {event.duration}
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ marginRight: '4px' }}>
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

      {/* 2. Interactivity: Pop-up Detailed Modal Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
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
            onClick={(e) => e.stopPropagation()}
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
              onClick={() => setIsOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
            >
              ✕
            </button>

            <span style={{ display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
              {event.category}
            </span>

            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '24px' }}>{event.title}</h2>
            
            <div style={{ marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
              <p style={{ margin: '6px 0' }}><strong>📍 Location:</strong> {event.location}</p>
              <p style={{ margin: '6px 0' }}><strong>Duration:</strong> {event.duration}</p>
              <p style={{ margin: '6px 0' }}><strong>Space Available:</strong> {event.seats} spots remaining</p>
              <p style={{ marginTop: '16px', color: '#555' }}>{event.description}</p>
            </div>

            <button 
              onClick={() => {
                alert(`Registered for ${event.title}!`);
                setIsOpen(false);
              }}
              style={{ width: '100%', padding: '14px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              Confirm Registration
            </button>
          </div>
        </div>
      )}
    </>
  );
}