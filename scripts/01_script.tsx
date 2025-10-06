import React from 'react';

/**
 * Environmental Impact Calculator - Fun Facts Script
 * This component returns a fun fact related to environmental science
 * and analytical chemistry methods.
 */
const EnvironmentalFact: React.FC = () => {
  const environmentalFacts = [
    "Green chemistry practices can reduce waste by up to 90% in some analytical methods.",
    "Modern HPLC systems can use up to 80% less solvent than traditional methods.",
    "Using room temperature analysis instead of heating can reduce the carbon footprint of a lab by up to 15%.",
    "Low-waste analytical methods can save thousands of liters of solvent waste per year in a busy laboratory.",
    "Miniaturized analytical techniques can reduce sample and reagent volumes by up to 1000 times.",
    "Automating sample preparation reduces human error and can save up to 30% in reagent usage.",
    "Replacing traditional solvents with water or bio-based solvents can reduce the EI score significantly.",
    "The average analytical chemistry lab produces 5-10 times more waste per person than a household.",
    "Non-destructive analytical techniques allow samples to be reused, reducing waste generation.",
    "Proper maintenance of analytical instruments can extend their lifetime by up to 50%."
  ];

  /**
   * Returns a random fact from the environmentalFacts array
   */
  const getRandomFact = (): string => {
    const randomIndex = Math.floor(Math.random() * environmentalFacts.length);
    return environmentalFacts[randomIndex];
  };

  return (
    <div className="environmental-fact-container">
      <h3>Did You Know?</h3>
      <p className="fact-text">{getRandomFact()}</p>
      <small>Environmental Impact Calculator - Making Chemistry Greener</small>
    </div>
  );
};

export default EnvironmentalFact;