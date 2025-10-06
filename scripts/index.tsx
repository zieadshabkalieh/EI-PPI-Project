import EnvironmentalFact from './01_script';
import HttpEndpoint, { httpHandler } from './02_http';
import CronJobSystem, { initializeCronJobs } from './03_cron';
import EmailProcessor, { processEmail, respondToEmail } from './04_email';

/**
 * Environmental Impact Calculator - Scripts Index
 * This file exports all the components and functions from the script files
 */

export {
  // 01_script.tsx - Environmental Facts
  EnvironmentalFact,
  
  // 02_http.tsx - HTTP Endpoint
  HttpEndpoint,
  httpHandler,
  
  // 03_cron.tsx - Cron Job System
  CronJobSystem,
  initializeCronJobs,
  
  // 04_email.tsx - Email Processor
  EmailProcessor,
  processEmail,
  respondToEmail
};

/**
 * Main App component that includes all scripts
 */
export const ScriptsApp = () => {
  return (
    <div className="scripts-container">
      <h1>Environmental Impact Calculator - Auxiliary Scripts</h1>
      
      <section className="script-section">
        <h2>Environmental Facts</h2>
        <EnvironmentalFact />
      </section>
      
      <section className="script-section">
        <h2>HTTP API Endpoint</h2>
        <HttpEndpoint />
      </section>
      
      <section className="script-section">
        <h2>Scheduled Tasks (Cron Jobs)</h2>
        <CronJobSystem />
      </section>
      
      <section className="script-section">
        <h2>Email Processing System</h2>
        <EmailProcessor />
      </section>
    </div>
  );
};

export default ScriptsApp;