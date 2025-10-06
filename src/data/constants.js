// This file contains constants used throughout the application

// Score color ranges based on the new EPPI total score interpretation table
export const SCORE_COLORS = {
  IDEAL: {
    range: [75, 100],
    color: '#2E7D32',  // Dark green
    className: 'result-ideal',
    label: 'Green and practical efficient method'
  },
  GOOD: {
    range: [50, 74.9],
    color: '#2ecc71',  // Light green
    className: 'result-good',
    label: 'Acceptable'
  },
  BAD: {
    range: [0, 49.9],
    color: '#e74c3c',  // Red
    className: 'result-bad',
    label: 'Non green and impractical'
  }
};

// Sample Preparation constants
export const SAMPLE_PREP = {
  PRE_SYNTHESIS: {
    NO: { value: 'no', score: 100 },
    YES: { value: 'yes', score: 75 }
  },
  // Updated yield values based on complex E factor (cEF)
  YIELD: {
    HIGH: { value: 'high', score: 10, description: 'cEF of 0.1 or less (>90%)' },
    MODERATE: { value: 'moderate', score: 5, description: 'cEF > 0.1-1 (50-90%)' },
    LOW: { value: 'low', score: -5, description: 'cEF > 1 (<50%)' }
  },
  // Keeping this for compatibility but we'll update the UI to use the new fields
  TEMPERATURE: {
    HIGH: { value: 'high', score: -10 },
    ROOM: { value: 'room', score: -5 },
    NONE: { value: 'none', score: 0 }
  },
  // New explicit fields for non-green solvent and occupational hazard
  NON_GREEN_SOLVENT: {
    YES: { value: true, score: -5 },
    NO: { value: false, score: 5 }
  },
  OCCUPATIONAL_HAZARD: {
    YES: { value: true, score: -5 },
    NO: { value: false, score: 5 }
  },
  SAMPLING_REQUIRED: {
    NONE: { value: 'none', score: 100 },
    MINIMAL: { value: 'minimal', score: 95 },
    MODERATE: { value: 'moderate', score: 85 }
  },
  SAMPLE_TYPE: {
    SIMPLE: { value: 'simple', score: 100 },
    EXTENSIVE: { value: 'extensive', score: 75 }
  },
  SAMPLE_THROUGHPUT: {
    HIGH: { value: 'high', score: 5 },
    MODERATE: { value: 'moderate', score: 0 },
    LOW: { value: 'low', score: -5 }
  },
  EXTRACTION: {
    NO: { value: 'no', score: 100 },
    YES: { value: 'yes', score: 60 }
  },
  SOLVENT_TYPE: {
    COMPLETE: { value: 'complete', score: 5 },
    PARTIAL: { value: 'partial', score: -5 },
    NON_GREEN: { value: 'nonGreen', score: -10 }
  },
  SOLVENT_VOLUME: {
    LESS_1: { value: 'less1', score: 10 },
    BETWEEN_1_AND_10: { value: 'between1And10', score: 5 },
    BETWEEN_10_AND_100: { value: 'between10And100', score: -5 },
    MORE_100: { value: 'more100', score: -10 }
  }
};

// Instrumentation constants
export const INSTRUMENTATION = {
  ENERGY: {
    NON: { value: 'non', score: 100 },
    LOW: { value: 'low', score: 95 },
    MODERATE: { value: 'moderate', score: 85 },
    HIGH: { value: 'high', score: 75 }
  },
  VAPOR_EMISSION: { score: -20 },
  NON_AUTOMATED: { score: -5 },
  MULTIANALYTE: { score: 5 },    // Adds 5 to total score
  MINIATURIZED: { score: 10 }    // Adds 10 to total score
};

// Reagent constants
export const REAGENT = {
  SOLVENT_TYPES: {
    WATER: { value: 'water' },
    ORGANIC: { value: 'organic' },
    ACID: { value: 'acid' },
    BASE: { value: 'base' },
    BUFFER: { value: 'buffer' },
    OTHER: { value: 'other' }
  },
  SIGNAL_WORDS: {
    WARNING: { value: 'warning' },
    DANGER: { value: 'danger' },
    NOT_AVAILABLE: { value: 'notAvailable' }
  },
  GHS_CLASS: {
    ZERO: { value: 'zero' },
    ONE: { value: 'one' },
    TWO: { value: 'two' },
    THREE: { value: 'three' }
  },
  VOLUMES: {
    LESS_1: { value: 'less1' },
    LESS_10: { value: 'less10' },
    BETWEEN_10_AND_100: { value: 'between10And100' },
    MORE_100: { value: 'more100' }
  },
  // Score matrix based on GHS class, signal word, and volume
  SCORES: {
    ZERO_PICTOGRAMS: 100,
    ONE_PICTO_WARNING: {
      LESS_1: 98,
      LESS_10: 96,
      BETWEEN_10_AND_100: 94,
      MORE_100: 92
    },
    ONE_PICTO_DANGER_OR_TWO_PICTO_WARNING: {
      LESS_1: 90,
      LESS_10: 85,
      BETWEEN_10_AND_100: 80,
      MORE_100: 75
    },
    TWO_PICTO_DANGER: {
      LESS_1: 70,
      LESS_10: 65,
      BETWEEN_10_AND_100: 60,
      MORE_100: 55
    },
    THREE_OR_MORE_PICTO: {
      LESS_1: 50,
      LESS_10: 45,
      BETWEEN_10_AND_100: 40,
      MORE_100: 35
    }
  }
};

// Waste constants
export const WASTE = {
  VOLUME: {
    LESS_1: { value: 'less1', score: 100 },
    BETWEEN_1_AND_10: { value: 'between1And10', score: 90 },
    BETWEEN_10_AND_100: { value: 'between10And100', score: 60 },
    MORE_100: { value: 'more100', score: 35 }
  },
  BIODEGRADABLE: {
    YES: { score: 10 },
    NO: { score: -10 }
  },
  TREATMENT: {
    NONE: { value: 'none', score: -5 },
    LESS_10: { value: 'less10', score: 10 },
    MORE_10: { value: 'more10', score: 20 }
  }
};
