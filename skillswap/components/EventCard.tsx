"use client";

import { useState } from 'react';

export interface EventData {
  id: number;
  title: string;
  location: string;
  type: 'workshop' | 'hackathon';
}

interface EventCardProps {
  event: EventData;
}

export default function EventCard({ event }: EventCardProps) {
  // State to manage the pop-up modal visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* 1. Main Event Card Preview (Clickable) */}
      <div 
        onClick={() => setIsOpen(true)}
        style={{ 
          border: '1px solid #ccc', 
          padding: '16px', 
          margin: '8px 0', 
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
      >
        <h3>{event.title}</h3>
        <p>📍 {event.location}</p>
        <small style={{ color: '#666', textTransform: 'capitalize' }}>
          {event.type} • Click for details
        </small>
      </div>

      {/* 2. Pop-up Modal Overlay (Only renders when isOpen is true) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} // Closes pop-up when clicking the background shading
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Forces it to sit on top of all other elements
          }}
        >
          {/* 3. Detailed Card Content */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the white box
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
              }}
            >
              ✕
            </button>

            {/* Detailed Info */}
            <span style={{ 
              display: 'inline-block',
              backgroundColor: event.type === 'hackathon' ? '#e1f5fe' : '#e8f5e9',
              color: event.type === 'hackathon' ? '#0288d1' : '#2e7d32',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              {event.type}
            </span>

            <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{event.title}</h2>
            
            <div style={{ marginBottom: '24px', color: '#444', lineHeight: '1.6' }}>
              <p><strong>📍 Venue:</strong> {event.location}</p>
              <p><strong>🕒 Time:</strong> 6:00 PM - 8:30 PM</p>
              <p><strong>📝 Description:</strong> This is a detailed look at {event.title}. Bring your laptop, your questions, and your enthusiasm! Catering and drinks will be provided at the venue.</p>
            </div>

            <button 
              onClick={() => {
                alert(`Registered for ${event.title}!`);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Register for Event
            </button>
          </div>
        </div>
      )}
    </>
  );
}