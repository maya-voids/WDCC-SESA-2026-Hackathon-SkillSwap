# SkillSwap

SkillSwap is a student-focused skill sharing marketplace built for the WDCC x SESA 2026 Hackathon.

The platform connects students who want to learn, teach, collaborate, and gain practical experience. Users can explore local tech opportunities, participate in events, share their own skills, and exchange value through a credit-based system.

## The Idea

Students often want to develop practical skills outside the classroom but do not always know where to find relevant opportunities or people with similar interests.

At the same time, students already have useful skills they could share with others.

SkillSwap brings these opportunities together in one marketplace.

Students can:

* Find workshops and tech events
* Share skills with other students
* Participate in student projects
* Find hackathons and expos
* Earn credits by contributing
* Spend credits on other opportunities
* Connect with students across New Zealand

## Features

### Skills Marketplace

Browse available opportunities through a marketplace designed around student learning and collaboration.

Listings include information such as:

* Title
* Description
* Host
* Location
* Address
* Date and time
* Skill categories
* Education level
* Service type
* Credit value

### Search and Filtering

Search the marketplace by skill, host, location, or listing information.

Listings can also be filtered by:

* City
* Service type
* Skill category
* Education level

Supported locations currently include:

* Auckland
* Hamilton
* Wellington
* Christchurch
* Dunedin
* Pukekohe

### Skill Categories

Current categories include:

* Web Development
* Web Design
* TypeScript
* Creative Design
* Python
* Firmware
* Hardware

### Different Opportunity Types

SkillSwap supports several forms of student participation:

* Workshops
* Expos
* Hackathons
* Student work
* Other community opportunities

### Credit System

SkillSwap uses credits to encourage students to contribute to the community.

Some activities reward credits while others require credits to participate.

Workshops and student work currently reward participation credits.

Other opportunities use credits when joining.

A user's current credit balance is shown directly in the marketplace.

### Join Opportunities

Students can join listed opportunities directly through the marketplace.

Joined activities are stored in a personal participation list and removed from the main marketplace view.

Users can open their list to view their current activities and remove items they no longer want displayed there.

### Share a Service

Users can publish their own opportunities.

A new listing includes:

* Title
* Description
* Image
* Address
* City
* Skill categories
* Service type
* Education level
* Duration
* Available seats
* Date and time
* Credit value

Published listings are added to the marketplace for other students to find.

## How It Works

```text
Student signs in
       ↓
Browses available skills and opportunities
       ↓
Searches or filters the marketplace
       ↓
Finds a relevant opportunity
       ↓
Joins the activity
       ↓
Credits are earned or spent
       ↓
Student gains experience and meets others
       ↺
Shares their own skills with the community
```

## Tech Stack

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| Next.js 16     | Application framework   |
| React 19       | User interface          |
| TypeScript     | Application development |
| Tailwind CSS 4 | Styling                 |
| Next.js Image  | Image optimisation      |
| Vitest         | Testing                 |
| ESLint         | Code quality            |
| JSON datasets  | Prototype data storage  |

## Getting Started

### Requirements

Install the following before running the project:

* Node.js
* npm

### Clone the Repository

```bash
git clone https://github.com/maya-voids/WDCC-SESA-2026-Hackathon-SkillSwap.git
cd WDCC-SESA-2026-Hackathon-SkillSwap/skillswap
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

## Available Commands

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run ESLint:

```bash
npm run lint
```

Run tests in watch mode:

```bash
npm test
```

Run the test suite once:

```bash
npm run test:run
```

## Data Modes

SkillSwap includes two data modes for development.

### Mock Mode

Uses seeded demonstration data together with newly published events.

```bash
npm run toggle -- mock
```

### Standard Mode

Uses the standard project datasets.

```bash
npm run toggle -- standard
```

Check the currently selected mode:

```bash
npm run toggle
```

After switching modes while the development server is running, refresh the browser.

## Project Structure

```text
WDCC-SESA-2026-Hackathon-SkillSwap/
│
└── skillswap/
    ├── app/
    │   ├── fonts/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── ...
    │
    ├── backend/
    │   ├── dataStorage/
    │   ├── DataUtils.ts
    │   ├── ProfileUtils.ts
    │   ├── dataSource.ts
    │   └── toggle.mjs
    │
    ├── components/
    │   ├── EventCard.tsx
    │   ├── CurrentEventsPanel.tsx
    │   └── JoinConfirmationPopup.tsx
    │
    ├── frontend/
    │   ├── components/
    │   │   ├── SkillSwapApp.tsx
    │   │   ├── LandingPage.tsx
    │   │   └── Marketplace.tsx
    │   └── styles/
    │
    ├── public/
    ├── package.json
    └── README.md
```

## Current Prototype

SkillSwap was developed as a hackathon project and currently uses a prototype architecture.

The application includes a mocked signed-in user and local JSON-backed datasets for marketplace information.

The prototype demonstrates the main product experience:

* Discovering skills and opportunities
* Searching and filtering listings
* Joining activities
* Tracking joined activities
* Earning and spending credits
* Publishing new opportunities

## Future Development

Potential next steps include:

* Full user authentication
* Persistent user accounts
* Cloud database integration
* User profiles
* Profile pictures and biographies
* Skill portfolios
* Direct messaging
* Real-time notifications
* Ratings and reviews
* Personalised recommendations
* Location-based recommendations
* Organisation and club accounts
* Event capacity management
* Waiting lists
* Credit transaction history
* Calendar integration
* Improved matching between students
* Mobile support

## Goal

SkillSwap aims to make student knowledge easier to share.

Instead of skills staying within individual classrooms, clubs, and friend groups, the platform provides one place for students to find opportunities, contribute what they know, and learn from others.

Learn something. Share something. SkillSwap.

## Hackathon

Built for the WDCC x SESA 2026 Hackathon.

## Repository

https://github.com/maya-voids/WDCC-SESA-2026-Hackathon-SkillSwap
