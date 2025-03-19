# Dharma Task Manager

A peer-to-peer task manager for the Synchronicity Engine, built with OrbitDB and Vue.js.

## Overview

The Dharma Task Manager is a decentralized task management application built on OrbitDB, a serverless, distributed, peer-to-peer database. It allows users to create, manage, and track tasks while accumulating "gratitude" for completed work. The application embodies the principles of the Synchronicity Engine by emphasizing a gratitude-based economy where value is measured by contribution.

## Features

- Create and manage Dharma Tasks with detailed descriptions and metadata
- Track task attention time and status (Pending, In Progress, Completed)
- Earn and accumulate Gratitude Tokens for task completion
- Transfer task stewardship to other users in the network
- Establish task lineage by connecting related tasks
- Completely decentralized with peer-to-peer data synchronization

## Technology Stack

- **Frontend**: Vue.js 3 with Vue Router and Pinia
- **Database**: OrbitDB (a peer-to-peer database built on IPFS)
- **Network**: Libp2p for peer discovery and communication
- **Build Tools**: Vite, Yarn, LightningCSS

## Getting Started

### Prerequisites

- Node.js 16+ and yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dharma-task-manager.git
cd dharma-task-manager
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Build for production:

```bash
yarn build
```

## OrbitDB Data Structure

The application uses two main OrbitDB document stores:

1. **dharma-tasks**: Stores task data including titles, descriptions, status, attention time, and stewardship information
2. **user-profiles**: Stores user information including names, aliases, and accumulated gratitude

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/     # Vue components
│   ├── models/         # Data models for Tasks and Users
│   ├── router/         # Vue Router configuration
│   ├── services/       # OrbitDB service
│   ├── stores/         # Pinia state stores
│   ├── views/          # Vue view components
│   ├── App.vue         # Main app component
│   ├── main.js         # Application entry point
│   └── style.css       # Global styles
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Usage

1. When first launched, the application will initialize OrbitDB and create a new user profile.
2. Create tasks from the dashboard or task list view.
3. Start tracking attention time on tasks to accumulate time-based metrics.
4. Mark tasks as completed to earn gratitude tokens.
5. View task details, including attention history and stewardship information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built on OrbitDB examples (https://github.com/orbitdb/orbitdb-examples)
- Inspired by the Synchronicity Engine documentation
