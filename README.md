# Polaris Portal

PS Number: SIH26063

Domain / Theme: Space Technology

Category: Software

Official Problem Statement:

“Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal”
my prompt : Build a highly polished, modern, interactive frontend web application for the Smart India Hackathon 2026 problem statement:

PS ID: SIH26063
Domain: Space Technology
Problem Statement: Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal

The product name is POLARIS.

This is a FRONTEND-FIRST prototype. Do not focus on backend implementation. Use realistic mock data and local state wherever necessary so that every interaction works in the browser.

CORE PRODUCT IDEA

PolarSphere is a unified digital platform for discovering, understanding and sharing polar science.

The platform brings together:

Polar science research

Arctic and Antarctic knowledge

Research papers and reports

Polar expeditions

Images and videos

Educational/outreach content

Interactive maps

News and announcements

AI-assisted knowledge discovery

The main differentiator is that PolarSphere connects scientific research, expeditions, media and educational content in one interactive ecosystem.

DESIGN DIRECTION

Create a premium, futuristic scientific interface inspired by:

Space technology

Arctic/Antarctic environments

Scientific dashboards

Satellite observation systems

Modern SaaS applications

Visual style:

Dark navy / deep blue background

White and cool-blue typography

Subtle cyan/ice-blue accents

Glassmorphism cards

Soft gradients

Thin borders

Subtle glow effects

Clean scientific data visualization

Large immersive hero sections

Smooth animations

Professional enough for an SIH judging presentation

Avoid making it look like a generic dashboard.

The website should feel like a real government/research-grade scientific platform.

Use:

Lucide icons

Smooth hover animations

Framer Motion where appropriate

Cards with subtle elevation

Animated counters

Skeleton/loading states where useful

Tooltips

Toast notifications

Responsive layouts

Use a consistent design system throughout the entire application.

APPLICATION STRUCTURE

Create THREE distinct role-based experiences:

USER

RESEARCHER

ADMIN

Create a role-selection/login screen so the demo can easily switch between these experiences.

The application should have a persistent sidebar/top navigation depending on the role.

PAGE 1 — USER PORTAL

Route concept:

/user

The User portal is designed for students, educators and the general public.

USER DASHBOARD

Create an immersive dashboard with:

Hero section

Title:

"Explore the World's Polar Science"

Subtitle:

"Discover research, expeditions, discoveries and stories from the Arctic and Antarctic."

Primary CTA:

"Explore Polar Science"

Secondary CTA:

"Explore Expeditions"

Add a beautiful polar/earth visual with subtle animated particles or an abstract satellite/orbit visual.

Statistics

Display animated statistics such as:

1,250+ Research Resources

85+ Expeditions

3,400+ Media Assets

120+ Educational Resources

Explore Polar Regions

Two large interactive cards:

ARCTIC

Climate

Ice

Ocean

Wildlife

ANTARCTIC

Ice Sheets

Climate

Oceanography

Research Stations

Cards should have hover effects.

Latest Discoveries

Create research/news cards with:

Title

Short description

Region

Topic

Year

Read More button

Featured Expeditions

Show 3 expedition cards with:

Expedition name

Location

Research objective

Status

Date

View Expedition button

Featured Media

Create an interactive media strip with:

Images

Videos

Infographics

USER — KNOWLEDGE EXPLORER

Create a page:

/user/repository

Title:

"Polar Knowledge Repository"

Features:

Large search bar

Search suggestions

Filters

Sort dropdown

Grid/list toggle

Filters:

Region:

Arctic

Antarctic

Topic:

Climate

Glaciology

Oceanography

Wildlife

Meteorology

Geology

Content type:

Research Paper

Report

Article

Dataset

Educational Resource

Year filter.

Each research card should contain:

Research title

Author

Region

Topic

Year

Short abstract

Tags

"View Details"

Make filtering and searching actually work using frontend state.

USER — RESEARCH DETAIL

When a research card is clicked, open a detailed research page or modal.

Show:

Research title

Authors

Institution

Publication year

Region

Topic

Abstract

Key findings

Related expeditions

Related media

Related educational content

Buttons:

"Read Research"

"Save"

"Share"

Use toast notifications for Save/Share.

USER — INTERACTIVE EXPEDITION MAP

Create:

/user/expeditions

This should be one of the most visually impressive pages.

Use an interactive world map with emphasis on:

Arctic

Antarctica

Show multiple expedition markers.

Clicking a marker should open an expedition information panel.

Example:

"Antarctic Climate Observation Expedition 2026"

Show:

Location

Research team

Research objective

Start date

End date

Status

Related research

Related media

Include filters:

Active

Completed

Upcoming

Use animated markers.

If a real map library is convenient, use Leaflet with OpenStreetMap. If not, create a polished stylized polar map visualization using frontend components.

USER — MEDIA GALLERY

Create:

/user/media

Tabs:

Images

Videos

Infographics

Include:

Search

Region filter

Topic filter

Media cards

Lightbox/modal when clicking an item

Video cards should open an embedded video modal or realistic video preview.

Make the gallery highly visual.

USER — SCIENCE OUTREACH

Create:

/user/learn

Title:

"Polar Science, Explained"

The purpose is to convert complex scientific topics into simple educational experiences.

Create topic cards:

Why is Antarctica important?

How do ice sheets change?

What causes sea-level rise?

How do satellites monitor polar regions?

What happens beneath Antarctic ice?

Why is Arctic sea ice important?

When opening a topic, show:

Simple explanation

Scientific explanation

Infographic

Important facts

Related research

Related media

Also create an interactive quiz section.

Example:

Question:

"Which region contains the South Pole?"

Options:

Arctic
Antarctica
Greenland
Siberia

Show immediate feedback and score.

USER — AI POLAR ASSISTANT

Create:

/user/assistant

Create a polished chat interface called:

"Polar Assistant"

Subtitle:

"Ask questions about polar science."

Example questions displayed as clickable suggestions:

Why is Antarctica important?

What causes Antarctic ice loss?

Show me research about Arctic climate.

What expeditions are currently active?

Explain polar science for a student.

When the user sends a message:

Display the user's message

Show an assistant response using realistic mock responses

Add related resource cards below responses

Add "View Research" buttons

Add "Explore Related Topics"

Do not make it look like a generic ChatGPT clone.

Make it feel like an AI assistant specifically connected to the PolarSphere knowledge repository.

PAGE 2 — RESEARCHER PORTAL

Route:

/researcher

This portal is designed for scientists and researchers.

Use a more data-focused interface than the User portal.

RESEARCHER DASHBOARD

Show:

My Research

Submitted Resources

Saved Research

Active Expeditions

Pending Reviews

Research Analytics

Statistics:

24 Publications

6 Active Projects

12 Saved Resources

3 Pending Submissions

Create a "Research Activity" chart.

Create a "Recent Research" table.

RESEARCHER — MY RESEARCH

Route:

/researcher/research

Show a table/grid of research uploaded by the researcher.

Columns:

Title

Region

Topic

Year

Status

Views

Date Added

Statuses:

Published

Pending Review

Draft

Rejected

Add:

"+ Submit Research"

button.

RESEARCHER — SUBMIT RESEARCH

Create an interactive form:

Fields:

Research title

Authors

Institution

Abstract

Region

Topic

Publication year

Keywords

Research document

Thumbnail

Related expedition

Add drag-and-drop upload UI.

Show upload progress animation.

After submission:

Show a success toast:

"Research submitted successfully for review."

Use frontend state to make the submission appear in the researcher's list as "Pending Review."

RESEARCHER — EXPEDITIONS

Create:

/researcher/expeditions

Show:

Active expeditions

Upcoming expeditions

Completed expeditions

Researchers can:

View expedition details

Create expedition

Edit expedition

Create a form with:

Expedition name

Region

Location

Coordinates

Research objective

Team members

Start date

End date

Status

RESEARCHER — RESEARCH DISCOVERY

Create a research discovery page where researchers can search the complete repository.

Add advanced filters:

Region

Research topic

Institution

Author

Publication year

Content type

Include:

"Related Research"

"Related Expeditions"

"Related Media"

to demonstrate the integrated nature of the platform.

PAGE 3 — ADMIN PORTAL

Route:

/admin

The Admin portal should look like a professional command center.

ADMIN DASHBOARD

Display:

Users:
1,248

Researchers:
184

Research Resources:
1,256

Media Assets:
3,482

Expeditions:
86

Educational Resources:
124

Pending Approvals:
17

Create charts for:

Content growth

User growth

Research submissions

Media uploads

Use realistic mock data.

ADMIN — CONTENT MANAGEMENT

Create tabs:

Research
Media
Expeditions
Education
News

Each section should have:

Search

Filter

Edit

Delete

Approve/Reject

For research submissions:

Show:

"Pending Review"

Buttons:

[Approve]
[Reject]
[View]

When approved, update the UI and show a toast notification.

ADMIN — USER MANAGEMENT

Create a user management table.

Columns:

Name

Email

Role

Status

Joined

Actions

Roles:

User

Researcher

Admin

Actions:

View

Edit

Disable

Use confirmation dialogs for destructive actions.

ADMIN — MEDIA MANAGEMENT

Allow admin to:

Upload media

Add title

Description

Region

Topic

Media type

URL

Show media preview.

ADMIN — ANALYTICS

Create an analytics page showing:

Most viewed research

Most popular topics

Most visited regions

Most viewed media

User engagement

Educational quiz participation

Use attractive charts.

GLOBAL NAVIGATION

Create a role-aware sidebar.

USER:

Dashboard
Knowledge Repository
Expeditions
Media
Learn
Polar Assistant
Saved

RESEARCHER:

Dashboard
My Research
Discover Research
Expeditions
Submit Research
Saved

ADMIN:

Dashboard
Content Management
Research Approvals
Media Management
User Management
Analytics

Add a profile menu.

Add:

Notifications

Settings

Logout

IMPORTANT INTERACTIONS

This must NOT be a static mockup.

Implement frontend interactions for:

Search

Filtering

Sorting

Navigation

Opening research details

Saving research

Sharing

Expedition marker selection

Media lightbox

Quiz scoring

AI chat simulation

Research submission

Admin approval/rejection

User management

Toast notifications

Modal dialogs

Tabs

Pagination where appropriate

Dark/light appearance if practical

Responsive mobile navigation

Use local state/mock data so the interactions work without a backend.

DEMO DATA

Use realistic polar-science data.

Create at least:

15 research resources

8 expeditions

15 media assets

8 educational topics

10 quiz questions

8 news/updates

8 researchers

15 users

Use realistic names, titles and descriptions.

Do not use lorem ipsum.

IMPORTANT UX REQUIREMENTS

The application should feel like a real product, not a template.

Add:

Empty states

Loading states

Error states

Success notifications

Hover states

Active navigation states

Smooth transitions

Responsive design

Accessible buttons

Keyboard-friendly interactions

Use consistent spacing and typography.

Avoid excessive animations.

Animations should feel subtle and scientific rather than flashy.

LANDING / ROLE SELECTION

Before entering the application, create a beautiful landing page.

Hero:

"POLARSPHERE"

"One Gateway to Polar Science"

Subtitle:

"Discover. Understand. Explore."

Show an animated Earth/polar visualization.

Then:

"Choose your experience"

Three large cards:

USER

"Explore polar science"

RESEARCHER

"Discover and contribute research"

ADMIN

"Manage the Polar Science ecosystem"

Each card has a button.

Clicking each card takes the user to the appropriate dashboard.

FOOTER

Include:

PolarSphere

"Integrated Polar Science Outreach & Knowledge Platform"

Links:

About
Knowledge Repository
Expeditions
Media
Education
Contact

Add:

"Built for Smart India Hackathon 2026"

TECHNICAL REQUIREMENTS

Use:

React

TypeScript

Tailwind CSS

Lucide React icons

Framer Motion where useful

Recharts for analytics

Leaflet/OpenStreetMap for maps if practical

Use reusable components.

Create a clean component architecture.

Example:

components/
Navbar
Sidebar
ResearchCard
ExpeditionCard
MediaCard
StatCard
FilterPanel
SearchBar
Modal
Toast
Map
Quiz
ChatInterface

Use mock data files rather than hardcoding everything inside components.

Keep the code modular and easy to connect to a Spring Boot REST API later.

Do NOT implement a real backend.

MOST IMPORTANT REQUIREMENT

The final website must communicate this story clearly:

Problem:
Polar-science information is fragmented and often difficult for different audiences to discover and understand.

Solution:
PolarSphere provides one integrated platform connecting:

Research
+
Expeditions
+
Media
+
Education
+
AI-assisted discovery

Unique value:
Instead of simply storing polar information, PolarSphere connects related scientific resources and transforms them into an interactive and understandable experience for users, researchers and institutions.

Build the application so that a Smart India Hackathon judge can understand the problem and solution within 30 seconds of opening the website.

Prioritize visual quality, interaction quality, information architecture and a convincing demo experience over unnecessary technical complexity.
also provide Timeline period from 1900-1920,1920-1940,1940-1960.....like that till 2026
with the description inside that, like if we like that timeline year,all research done in that peroid should be visible,make it animated with rockets if possible
also fetch/use this real data/info from this websites
 2. Collect legitimate data

→ NPDC datasets/metadata

→ NCPOR publications & expedition reports

→ ISRO/VEDAS polar resources

→ Other permitted open sources
also build a polar map

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b3f629f-7961-4483-b7d1-b5b39fbe3327).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
