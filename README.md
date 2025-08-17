# Job Tracker App

A full-stack web application to manage and track job applications with authentication, easy tracking, and organized workflow.

## Features
1. **Job Application Entry** – Add new job postings with details such as company name, position, status, and application date.
2. **Application Management** – View, update, or delete job entries to track your progress and changes over time.
3. **Search & Filter** – Search job entries by company or position, and filter based on status (e.g., applied, interview, offer, rejected).
4. **Authentication** – Secure user registration and login using password hashing and optional Google OAuth for easy access.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Templating**: Handlebars (HBS)
- **Authentication**: Passport.js with Local Strategy & Google OAuth 2.0

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/simransh05/Job-Tracker-App.git
cd Job-Tracker-App
```
### 2. Install Dependencies 
```bash
npm install
```

### 3. Create a ```.env``` File
Create a file named .env in the root folder and add the following:
```env
DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REDIRECT_URI=redirect_url
```

### 4. Start the Server
```bash
node app.js
```
Then open http://localhost:4000 in your browser.
