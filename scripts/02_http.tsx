import React from 'react';
import { Request, Response } from 'express';

/**
 * Environmental Impact Calculator - HTTP Endpoint
 * This component creates an HTTP endpoint that provides a greeting
 * and basic information about the Environmental Impact Calculator.
 */

interface ApiRequest extends Request {
  query: {
    name?: string;
    module?: string;
  }
}

interface ApiResponse {
  greeting: string;
  message: string;
  timestamp: string;
  module?: string;
  info: {
    version: string;
    description: string;
    features: string[];
  }
}

/**
 * HTTP handler function for the Environmental Impact Calculator API
 * @param req - The HTTP request object (extended with our custom query params)
 * @param res - The HTTP response object
 */
export const httpHandler = (req: ApiRequest, res: Response): void => {
  const name = req.query.name || 'Scientist';
  const module = req.query.module;
  
  const responseData: ApiResponse = {
    greeting: `Hello, ${name}!`,
    message: 'Welcome to the Environmental Impact (EI) Scale Calculator API',
    timestamp: new Date().toISOString(),
    info: {
      version: '1.0.0',
      description: 'Calculate and visualize Environmental Impact scores for analytical chemistry methods',
      features: [
        'Sample Preparation Impact Analysis',
        'Instrumentation Sustainability Metrics',
        'Reagent Usage Evaluation',
        'Waste Management Assessment',
        'Comprehensive EI Score Calculation',
        'Export Results to PDF and Excel'
      ]
    }
  };
  
  // Add module-specific information if requested
  if (module) {
    responseData.module = module;
    
    switch (module.toLowerCase()) {
      case 'sampleprep':
        responseData.message = 'The Sample Preparation module evaluates environmental friendliness and efficiency of sample preparation techniques.';
        break;
      case 'instrumentation':
        responseData.message = 'The Instrumentation module assesses the sustainability of analytical instruments and their energy consumption.';
        break;
      case 'reagent':
        responseData.message = 'The Reagent module evaluates the environmental impact of solvents and chemicals used in analytical methods.';
        break;
      case 'waste':
        responseData.message = 'The Waste module measures the impact of waste generation and management in analytical procedures.';
        break;
      default:
        responseData.message = `Module '${module}' not recognized. Available modules: sampleprep, instrumentation, reagent, waste`;
    }
  }
  
  // Send the JSON response
  res.status(200).json(responseData);
};

/**
 * React component representation of the HTTP endpoint
 * This is for documentation purposes only - the actual endpoint is handled by the httpHandler function
 */
const HttpEndpoint: React.FC = () => {
  return (
    <div className="api-documentation">
      <h2>Environmental Impact Calculator API</h2>
      <p>This endpoint provides information about the Environmental Impact Calculator.</p>
      
      <h3>Usage:</h3>
      <pre>GET /api/calculator?name=YourName&module=ModuleName</pre>
      
      <h3>Query Parameters:</h3>
      <ul>
        <li><strong>name</strong> (optional): Your name for personalized greeting</li>
        <li><strong>module</strong> (optional): Get specific information about a module
          <ul>
            <li>sampleprep - Sample Preparation module</li>
            <li>instrumentation - Instrumentation module</li>
            <li>reagent - Reagent module</li>
            <li>waste - Waste module</li>
          </ul>
        </li>
      </ul>
      
      <h3>Example Response:</h3>
      <pre>
{`{
  "greeting": "Hello, Scientist!",
  "message": "Welcome to the Environmental Impact (EI) Scale Calculator API",
  "timestamp": "2025-04-17T12:34:56.789Z",
  "info": {
    "version": "1.0.0",
    "description": "Calculate and visualize Environmental Impact scores for analytical chemistry methods",
    "features": [
      "Sample Preparation Impact Analysis",
      "Instrumentation Sustainability Metrics",
      "Reagent Usage Evaluation",
      "Waste Management Assessment",
      "Comprehensive EI Score Calculation",
      "Export Results to PDF and Excel"
    ]
  }
}`}
      </pre>
    </div>
  );
};

export default HttpEndpoint;