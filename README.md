# [College Football Scout Helper]

CodePath WEB103 Final Project

Designed and developed by: Lukman Adeyemi, Joseph Siggia and Maria Khan

🔗 Link to deployed app:

## About
An app that allows student football players to showcase their skills to scouts.


### ✅ Description and Purpose

College Football Scout Helper is a full-stack web application that helps college football clubs, intramural teams, and student players connect through a centralized scouting platform.

Student players verify their identity before creating a profile. The system then retrieves and automatically populates verified football information such as playing position, preferred foot, skill level, and performance statistics from a simulated player registry. Players can complete additional profile information such as their biography, profile image, and availability.

Team captains and coaches can browse player profiles, search for players based on specific criteria, maintain a scouting list, and invite promising players to team tryouts.

The goal of this application is to simplify player recruitment within a college environment by giving student athletes an opportunity to showcase their abilities while providing campus football teams with an efficient way to discover and recruit new talent.


### Inspiration

Many talented college students are interested in playing football but often do not know how to join a team or demonstrate their abilities to coaches. Likewise, college football clubs and intramural teams frequently rely on word-of-mouth, social media, or informal recommendations when recruiting players.

College Football Scout Helper was inspired by the idea of creating a dedicated scouting platform where student players can present their football experience and skills while allowing coaches and team captains to efficiently identify, evaluate, and recruit players who fit their team's needs.

## Tech Stack

Frontend:
React
React Router
JavaScript
HTML
CSS

Backend:

Node.js
Express.js
PostgreSQL
pg
dotenv
CORS

## Features

### ✅ Database Reset
The backend includes a database reset feature that restores the application to its default state with sample teams, coaches, players, and scouting records.


<img width="1920" height="1020" alt="Database" src="https://github.com/user-attachments/assets/38aa28fb-a212-442f-a259-2eba8a590240" />


## Player Identity and Profile Verification (Custom 1)

Student players must verify their identity using their first name, last name, and date of birth before creating a football profile.

The application checks the submitted details against a pre-seeded demo player registry. When a match is found, the system automatically populates verified football information, including:

- Primary and secondary playing positions
- Preferred foot
- Skill level
- Class year
- Goals
- Assists
- Clean sheets
- Games played

Verified football fields are read-only and cannot be manually changed by the player. Players can still add personal information such as their profile image, biography, and availability.

This feature uses simulated verification records for demonstration purposes and is not connected to an official sports governing body.

<img src="./client/public/images/Player%20Verification%207.gif"
     alt="Player Verification Demo"
     width="900">

### Search, Filter, and Sort Players(Custom 2)
Search for players and quickly filter them by:
Playing Position
Class Year
Skill Level
Availability
Players can also be sorted by:
Goals
Assists
Skill Level

### Student Player Profiles

Students can create, edit, update, and delete football profiles containing their personal information, playing position, preferred foot, skill level, availability, goals, assists, clean sheets, and games played.


[gif goes here]

### Team Profiles

View information about college football teams, including team name, division, captain, and current roster.



[gif goes here]

### Scout List

Team captains and coaches can save promising players to their personal scout list while keeping track of scouting progress through statuses such as Interested, Watching, Contacted, Tryout Invited, and Added to Team.


### Tryout Invitation Modal (Custom 3)
Captains and coaches can invite players to upcoming tryouts using a popup modal without leaving the current page. Invitations include the tryout date, location, and a personalized message.

### Player Statistics
Display football statistics for each player, including:
Goals
Assists
Clean Sheets
Games Played
These statistics help coaches evaluate player performance.

### Form Validation
Player information is validated before submission to ensure all required fields are completed and statistics contain valid values.
Examples include:
Position is required.
Class year is required.
Goals cannot be negative.
Assists cannot be negative.

### Dynamic Player Pages
Each player has a dedicated profile page displaying their complete football profile, statistics, and scouting information.

### Responsive User Interface
The application is fully responsive and optimized for desktop, tablet, and mobile devices.


### AI Assistant(Custom 4)
An AI assistant that helps the user accomplish their tasks.  




[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

Installation Instructions
1. Clone the repository
git clone <repository-url>
2. Navigate into the project folder
cd college-football-scout-helper
3. Install backend dependencies
cd server
npm install
4. Install frontend dependencies
cd ../client
npm install
5. Configure environment variables
Create a .env file inside the server directory and add your PostgreSQL database connection information.
6. Seed the database
npm run reset
7. Start the backend server
npm run dev
8. Start the frontend
cd ../client
npm run dev
9. Open the application
Visit the local development URL displayed in the terminal to begin using College Football Scout Helper.

