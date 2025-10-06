# Environmental Impact Calculator Scripts

This directory contains auxiliary scripts and components for the Environmental Impact Calculator application. These scripts provide additional functionality such as displaying environmental facts, handling HTTP requests, managing scheduled tasks, and processing emails.

## Script Files

### 1. Environmental Facts (01_script.tsx)

This script provides random facts about environmental impact and green chemistry. It can be integrated into the application to educate users about environmental sustainability in analytical chemistry.

**Key Features:**
- Random fact generation
- Educational content about green chemistry
- React component for easy integration

### 2. HTTP API Endpoint (02_http.tsx)

This script creates an HTTP endpoint that provides information about the Environmental Impact Calculator. It's designed to be used as an API for external applications or services.

**Key Features:**
- RESTful API endpoint
- Customizable responses based on query parameters
- Module-specific information retrieval
- Documentation of the API usage

### 3. Scheduled Tasks (03_cron.tsx)

This script sets up cron jobs for various maintenance tasks related to the Environmental Impact Calculator. It handles database backups, usage statistics, and system health checks.

**Key Features:**
- Automated database backups
- Weekly usage statistics generation
- Monthly system health checks
- Clear schedule management

### 4. Email Processing (04_email.tsx)

This script handles incoming emails for the Environmental Impact Calculator system. It categorizes emails, assigns priorities, and generates appropriate responses.

**Key Features:**
- Email categorization (support, feedback, calculation, report)
- Priority assignment
- Automated response generation
- Processing and tracking system

## Usage

To use these scripts, you can import them from the index file:

```tsx
import { 
  EnvironmentalFact, 
  HttpEndpoint, 
  CronJobSystem, 
  EmailProcessor 
} from './scripts';

// Or import the complete app
import ScriptsApp from './scripts';
```

## Installation

1. Install dependencies:
   ```
   cd scripts
   npm install
   ```

2. Run the scripts:
   ```
   npm start
   ```

## Dependencies

These scripts require the following dependencies:
- React
- Express
- Cron
- TypeScript

See the package.json file for the complete list of dependencies and their versions.

## Integration with Main Application

These scripts can be integrated into the main Environmental Impact Calculator application as needed. The React components can be used directly in the UI, while the utility functions can be used in the application logic.

## License

MIT