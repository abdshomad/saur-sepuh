# Next Enhancements & Future Roadmap

This document outlines the planned and potential future enhancements for the "Saur Sepuh: Legenda Madangkara" game simulator. These features are designed to add depth, improve player engagement, and provide a more robust and complete gameplay experience.

## 🎯 Core Gameplay Mechanics

These features are essential to complete the primary gameplay loop and introduce strategic depth.

| ID         | Feature                      | Status      | Implemented On             |
| :--------- | :--------------------------- | :---------- | :------------------------- |
| **CG-004** | Player vs. Player (PvP) Combat | Not Started | N/A                        |

---

### Feature Details

#### CG-004: Player vs. Player (PvP) Combat
-   **Description:** Design and implement a system for players to attack each other's kingdoms.
-   **Note:** This is a major feature that requires a backend server for matchmaking and state management.

---

## 📈 Player Progression & Engagement

Features to keep players invested and returning to the game.

| ID         | Feature                         | Status      | Implemented On |
| :--------- | :------------------------------ | :---------- | :------------- |
| **PP-002** | Alliances (Kadipaten / Paguronan) | Not Started | N/A            |
| **PP-003** | Leaderboards                    | Not Started | N/A            |
| **PP-004** | Achievements (Gelar Kehormatan) | Not Started | N/A            |

---

### Feature Details

#### PP-002: Alliances (Kadipaten / Paguronan)
-   **Description:** Introduce social features allowing players to form or join alliances.
-   **Tasks:**
    -   Implement functionality for creating, joining, and managing alliances.
    -   Add an alliance chat system.
    -   Create a system for members to help speed up each other's timers.

#### PP-003: Leaderboards
-   **Description:** Add global rankings to foster competition.
-   **Tasks:**
    -   Design and implement a UI to display rankings for player level, army power, or PvE victories.

#### PP-004: Achievements (Gelar Kehormatan)
-   **Description:** Define a set of milestones that grant players permanent titles or small rewards.
-   **Tasks:**
    -   Create a list of achievable milestones (e.g., "Reach Istana Level 10").
    -   Track player progress towards these achievements.
    -   Create a UI to display completed and in-progress achievements.

---

## ✨ User Experience (UX) & Quality of Life (QoL)

Polishing features to make the game feel more professional and immersive.

| ID         | Feature                        | Status      | Implemented On |
| :--------- | :----------------------------- | :---------- | :------------- |
| **UX-001** | Sound and Music                | Not Started | N/A            |
| **UX-002** | Animations and Visual Feedback | Not Started | N/A            |
| **UX-003** | Browser Notifications          | Not Started | N/A            |
| **UX-004** | Enhanced Tooltips              | Not Started | N/A            |

---

### Feature Details

#### UX-001: Sound and Music
-   **Description:** Integrate audio to enhance immersion.
-   **Tasks:**
    -   Add thematic background music.
    -   Implement sound effects for UI interactions, upgrade completions, and combat.

#### UX-002: Animations and Visual Feedback
-   **Description:** Incorporate subtle animations to make the UI more dynamic.
-   **Tasks:**
    -   Add an animation for completed timers.
    -   Show resource icons popping up from production buildings.
    -   Add more hover and focus effects to interactive elements.

#### UX-003: Browser Notifications
-   **Description:** Implement web notifications for long timers.
-   **Tasks:**
    -   Add a settings option to request notification permission.
    -   Use the Web Notifications API to alert players when upgrades or research tasks are complete.

#### UX-004: Enhanced Tooltips
-   **Description:** Provide more detailed information on hover.
-   **Tasks:**
    -   Implement tooltips for buildings that show production rates or training capabilities.
    -   Add tooltips for resources showing current production per hour.

---

## 🔧 Technical & Architectural Improvements

Crucial "under-the-hood" changes for a scalable and robust application.

| ID         | Feature                    | Status      | Implemented On |
| :--------- | :------------------------- | :---------- | :------------- |
| **TA-002** | Backend Server             | Not Started | N/A            |
| **TA-003** | Dedicated State Management | Not Started | N/A            |

---

### Feature Details

#### TA-002: Backend Server
-   **Description:** Create a backend service for a true multiplayer experience and to secure the application.
-   **Tasks:**
    -   Migrate player data storage from `localStorage` to a database.
    -   Proxy AI API requests to protect the API key.
    -   Implement server-authoritative logic for player interactions (PvP, alliances, chat).

#### TA-003: Dedicated State Management
-   **Description:** Migrate from `useState` to a dedicated state management library for better scalability.
-   **Tasks:**
    -   Refactor the application to use a library like Zustand or Jotai.
    -   Separate state logic from the main `App` component into a dedicated store.