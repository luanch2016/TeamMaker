# TeamMaker

TeamMaker is a Next.js application designed to help users form teams of 3-5 members efficiently. It allows team leaders to create teams and members to join them until the capacity is reached.

## Features

- **Create Team**: Leaders can create a new team with a Subject ID, Name, and Email.
- **Join Team**: Members can join existing teams by providing their Name and Email.
- **Capacity Management**: Teams are limited to 5 members. Status updates to 'FULL' automatically.
- **Data Persistence**: Simple JSON-based local storage.
- **Real-time Dashboard**: View all teams and their statuses.
- **Delete Team**: Remove teams when they are no longer needed.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/team-maker.git
    cd team-maker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/teams`: Fetch all teams.
- `POST /api/teams`: Create a new team.
- `POST /api/teams/[id]/join`: Join a specific team.
- `DELETE /api/teams/[id]`: Delete a specific team.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `app/components/`: Reusable UI components (TeamCard, Forms).
- `lib/`: Helper functions (data persistence).
- `data/`: JSON storage file.

## License

This project is open source and available under the [MIT License](LICENSE).
