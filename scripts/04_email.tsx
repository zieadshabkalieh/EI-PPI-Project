import React from 'react';

/**
 * Environmental Impact Calculator - Email Handler
 * This component processes incoming emails related to the
 * Environmental Impact Calculator application.
 */

interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

interface EmailPayload {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  receivedAt: Date;
}

interface ProcessedEmail {
  id: string;
  type: 'support' | 'feedback' | 'calculation' | 'report' | 'unknown';
  priority: 'high' | 'medium' | 'low';
  payload: EmailPayload;
  processedAt: Date;
  assignedTo?: string;
  status: 'new' | 'in-progress' | 'resolved' | 'archived';
}

/**
 * Email processor function for the Environmental Impact Calculator
 * @param email - The raw email payload
 * @returns The processed email with type, priority, and status
 */
export const processEmail = (email: EmailPayload): ProcessedEmail => {
  // Generate a unique ID for the email
  const id = `email-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine the type of email
  let type: 'support' | 'feedback' | 'calculation' | 'report' | 'unknown' = 'unknown';
  let priority: 'high' | 'medium' | 'low' = 'medium';
  
  const subject = email.subject.toLowerCase();
  const text = (email.text || '').toLowerCase();
  
  // Check for specific keywords to categorize the email
  if (subject.includes('support') || subject.includes('help') || text.includes('issue') || text.includes('problem')) {
    type = 'support';
    
    // Set priority based on urgency keywords
    if (subject.includes('urgent') || subject.includes('critical') || text.includes('urgent') || text.includes('critical')) {
      priority = 'high';
    }
  } 
  else if (subject.includes('feedback') || subject.includes('suggestion') || text.includes('improve')) {
    type = 'feedback';
    priority = 'medium';
  }
  else if (subject.includes('calculation') || subject.includes('ei score') || 
           text.includes('calculation') || text.includes('method results')) {
    type = 'calculation';
    
    // Check for attached files
    if (email.attachments && email.attachments.length > 0) {
      priority = 'high';
    } else {
      priority = 'medium';
    }
  }
  else if (subject.includes('report') || subject.includes('export') || 
           text.includes('report') || text.includes('pdf') || text.includes('excel')) {
    type = 'report';
    priority = 'low';
  }
  
  // Create a processed email object
  const processedEmail: ProcessedEmail = {
    id,
    type,
    priority,
    payload: email,
    processedAt: new Date(),
    status: 'new'
  };
  
  // Log the email processing for demonstration
  console.log(`[${processedEmail.processedAt.toISOString()}] Email processed:`);
  console.log(`- ID: ${processedEmail.id}`);
  console.log(`- Type: ${processedEmail.type}`);
  console.log(`- Priority: ${processedEmail.priority}`);
  console.log(`- From: ${email.from}`);
  console.log(`- Subject: ${email.subject}`);
  
  return processedEmail;
};

/**
 * Function to handle responding to processed emails
 * @param processedEmail - The processed email object
 */
export const respondToEmail = (processedEmail: ProcessedEmail): void => {
  const { payload, type } = processedEmail;
  let responseSubject = '';
  let responseText = '';
  
  switch (type) {
    case 'support':
      responseSubject = `RE: ${payload.subject} [Ticket #${processedEmail.id}]`;
      responseText = `
        Thank you for contacting the Environmental Impact Calculator Support team.
        
        We have received your request and created support ticket #${processedEmail.id}.
        A member of our support team will review your issue and respond shortly.
        
        For urgent issues, please include your calculation details and specific error messages.
        
        Best regards,
        Environmental Impact Calculator Support Team
      `;
      break;
      
    case 'feedback':
      responseSubject = `RE: ${payload.subject} [Feedback Received]`;
      responseText = `
        Thank you for your feedback on the Environmental Impact Calculator.
        
        We appreciate your suggestions and have recorded them for consideration in future updates.
        Your input helps us improve the tool for all scientists and researchers working to reduce
        environmental impact in analytical methods.
        
        Best regards,
        Environmental Impact Calculator Development Team
      `;
      break;
      
    case 'calculation':
      responseSubject = `RE: ${payload.subject} [Calculation Received]`;
      responseText = `
        Thank you for submitting your calculation to the Environmental Impact Calculator system.
        
        We have received your calculation data and will process it shortly. If you have attached
        files, our system will analyze them and provide detailed Environmental Impact scores.
        
        You will receive the results within 24 hours.
        
        Best regards,
        Environmental Impact Calculator Analysis Team
      `;
      break;
      
    case 'report':
      responseSubject = `RE: ${payload.subject} [Report Request]`;
      responseText = `
        Thank you for your report request from the Environmental Impact Calculator.
        
        We have received your request for exported data. If you have specified specific
        formatting requirements, our system will process your report accordingly.
        
        The report will be generated and sent to you within 24 hours.
        
        Best regards,
        Environmental Impact Calculator Reporting Team
      `;
      break;
      
    default:
      responseSubject = `RE: ${payload.subject} [Receipt Confirmation]`;
      responseText = `
        Thank you for your message to the Environmental Impact Calculator team.
        
        We have received your email and will respond appropriately.
        
        Best regards,
        Environmental Impact Calculator Team
      `;
  }
  
  // Log the response (in a real system, this would send an actual email)
  console.log(`[${new Date().toISOString()}] Sending response email:`);
  console.log(`- To: ${payload.from}`);
  console.log(`- Subject: ${responseSubject}`);
  console.log(`- Response type: ${type}`);
};

/**
 * React component for visualizing the email processing system
 */
const EmailProcessor: React.FC = () => {
  // Example email for demonstration
  const exampleEmail: EmailPayload = {
    from: 'researcher@example.com',
    to: ['support@ei-calculator.org'],
    subject: 'Question about Sample Preparation score calculation',
    text: 'Hello, I have a question about how the sample preparation scores are calculated for high-throughput methods. Can you explain the formula used?',
    receivedAt: new Date()
  };
  
  // Process the example email
  const processedExample = processEmail(exampleEmail);
  
  return (
    <div className="email-processor">
      <h2>Environmental Impact Calculator - Email Processor</h2>
      <p>This system processes incoming emails related to the Environmental Impact Calculator.</p>
      
      <div className="email-example">
        <h3>Example Email Processing</h3>
        
        <div className="email-input">
          <h4>Incoming Email</h4>
          <div><strong>From:</strong> {exampleEmail.from}</div>
          <div><strong>To:</strong> {exampleEmail.to.join(', ')}</div>
          <div><strong>Subject:</strong> {exampleEmail.subject}</div>
          <div><strong>Content:</strong> {exampleEmail.text}</div>
        </div>
        
        <div className="email-output">
          <h4>Processed Result</h4>
          <div><strong>ID:</strong> {processedExample.id}</div>
          <div><strong>Type:</strong> {processedExample.type}</div>
          <div><strong>Priority:</strong> {processedExample.priority}</div>
          <div><strong>Status:</strong> {processedExample.status}</div>
          <div><strong>Processed At:</strong> {processedExample.processedAt.toLocaleString()}</div>
        </div>
        
        <button onClick={() => respondToEmail(processedExample)}>
          Generate Automated Response
        </button>
      </div>
      
      <div className="email-types">
        <h3>Email Categories</h3>
        <ul>
          <li><strong>Support:</strong> Questions and issues with the calculator</li>
          <li><strong>Feedback:</strong> Suggestions and feedback for improvements</li>
          <li><strong>Calculation:</strong> Requests for specific EI calculations</li>
          <li><strong>Report:</strong> Requests for exported reports and data</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailProcessor;