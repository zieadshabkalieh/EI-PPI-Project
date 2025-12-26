// Predefined templates for common analytical methods

export const methodTemplates = [
  {
    id: 'hplc-basic',
    name: 'Basic HPLC Method',
    description: 'Standard high-performance liquid chromatography method with minimal environmental impact.',
    data: {
      samplePrep: {
        preSynthesis: 'no',
        yield: 'high',
        temperature: 'room',
        purification: false,
        energyConsumption: false,
        nonGreenSolvent: true,
        occupationalHazard: false,
        instrumentRequirements: 'basic',
        sampleType: 'simple',
        derivatization: false,
        sampleThroughput: 'high',
        automatedPreparation: true,
        inSituPreparation: false,
        offline: true,
        extractionNeeded: 'no',
        solventType: 'partial',
        solventVolume: 'less1',
        renewableAdsorbent: false
      },
      instrumentation: {
        energy: 'medium',
        vaporEmission: false,
        nonAutomated: 'automated',
        notMultianalyte: false,
        maintenanceLifetime: 2
      },
      reagents: [
        {
          solventType: 'methanol',
          signalWord: 'warning',
          ghsClass: 'flammable',
          volume: 'medium'
        },
        {
          solventType: 'acetonitrile',
          signalWord: 'danger',
          ghsClass: 'toxicFlammable',
          volume: 'small'
        },
        {
          solventType: 'water',
          signalWord: 'none',
          ghsClass: 'none',
          volume: 'large'
        }
      ],
      waste: {
        volume: 'less5',
        biodegradable: false,
        treatment: 'specialized'
      }
    }
  },
  {
    id: 'gc-standard',
    name: 'Standard GC Method',
    description: 'Gas chromatography method for volatile compound analysis.',
    data: {
      samplePrep: {
        preSynthesis: 'no',
        yield: 'medium',
        temperature: 'high',
        purification: true,
        energyConsumption: true,
        nonGreenSolvent: true,
        occupationalHazard: false,
        instrumentRequirements: 'specialized',
        sampleType: 'complex',
        derivatization: true,
        sampleThroughput: 'moderate',
        automatedPreparation: true,
        inSituPreparation: false,
        offline: true,
        extractionNeeded: 'liquid',
        solventType: 'non',
        solventVolume: 'less5',
        renewableAdsorbent: false
      },
      instrumentation: {
        energy: 'high',
        vaporEmission: true,
        nonAutomated: 'automated',
        notMultianalyte: false,
        maintenanceLifetime: 1
      },
      reagents: [
        {
          solventType: 'hexane',
          signalWord: 'danger',
          ghsClass: 'toxicFlammable',
          volume: 'medium'
        },
        {
          solventType: 'dichloromethane',
          signalWord: 'warning',
          ghsClass: 'health',
          volume: 'small'
        }
      ],
      waste: {
        volume: 'less5',
        biodegradable: false,
        treatment: 'incineration'
      }
    }
  },
  {
    id: 'green-extraction',
    name: 'Green Extraction Method',
    description: 'Environmentally friendly extraction using water and green solvents.',
    data: {
      samplePrep: {
        preSynthesis: 'no',
        yield: 'high',
        temperature: 'room',
        purification: false,
        energyConsumption: false,
        nonGreenSolvent: false,
        occupationalHazard: false,
        instrumentRequirements: 'none',
        sampleType: 'simple',
        derivatization: false,
        sampleThroughput: 'high',
        automatedPreparation: false,
        inSituPreparation: true,
        offline: false,
        extractionNeeded: 'water',
        solventType: 'green',
        solventVolume: 'less1',
        renewableAdsorbent: true
      },
      instrumentation: {
        energy: 'low',
        vaporEmission: false,
        nonAutomated: 'automated',
        notMultianalyte: false,
        maintenanceLifetime: 3
      },
      reagents: [
        {
          solventType: 'water',
          signalWord: 'none',
          ghsClass: 'none',
          volume: 'medium'
        },
        {
          solventType: 'ethanol',
          signalWord: 'warning',
          ghsClass: 'flammable',
          volume: 'small'
        }
      ],
      waste: {
        volume: 'less1',
        biodegradable: true,
        treatment: 'none'
      }
    }
  },
  {
    id: 'spectroscopy-basic',
    name: 'Basic Spectroscopy Method',
    description: 'Simple spectroscopic analysis with minimal sample preparation.',
    data: {
      samplePrep: {
        preSynthesis: 'no',
        yield: 'high',
        temperature: 'room',
        purification: false,
        energyConsumption: false,
        nonGreenSolvent: false,
        occupationalHazard: false,
        instrumentRequirements: 'basic',
        sampleType: 'simple',
        derivatization: false,
        sampleThroughput: 'high',
        automatedPreparation: false,
        inSituPreparation: true,
        offline: false,
        extractionNeeded: 'no',
        solventType: 'partial',
        solventVolume: 'less1',
        renewableAdsorbent: false
      },
      instrumentation: {
        energy: 'medium',
        vaporEmission: false,
        nonAutomated: 'automated',
        notMultianalyte: true,
        maintenanceLifetime: 3
      },
      reagents: [
        {
          solventType: 'water',
          signalWord: 'none',
          ghsClass: 'none',
          volume: 'small'
        }
      ],
      waste: {
        volume: 'less1',
        biodegradable: true,
        treatment: 'none'
      }
    }
  },
  {
    id: 'mass-spec-advanced',
    name: 'Advanced Mass Spectrometry',
    description: 'High-resolution mass spectrometry with complex sample preparation.',
    data: {
      samplePrep: {
        preSynthesis: 'no',
        yield: 'medium',
        temperature: 'low',
        purification: true,
        energyConsumption: true,
        nonGreenSolvent: true,
        occupationalHazard: false,
        instrumentRequirements: 'specialized',
        sampleType: 'complex',
        derivatization: true,
        sampleThroughput: 'low',
        automatedPreparation: true,
        inSituPreparation: false,
        offline: true,
        extractionNeeded: 'liquid',
        solventType: 'non',
        solventVolume: 'less10',
        renewableAdsorbent: false
      },
      instrumentation: {
        energy: 'high',
        vaporEmission: true,
        nonAutomated: 'automated',
        notMultianalyte: false,
        maintenanceLifetime: 1
      },
      reagents: [
        {
          solventType: 'methanol',
          signalWord: 'warning',
          ghsClass: 'flammable',
          volume: 'medium'
        },
        {
          solventType: 'acetonitrile',
          signalWord: 'danger',
          ghsClass: 'toxicFlammable',
          volume: 'medium'
        },
        {
          solventType: 'formic_acid',
          signalWord: 'danger',
          ghsClass: 'corrosive',
          volume: 'small'
        }
      ],
      waste: {
        volume: 'less10',
        biodegradable: false,
        treatment: 'specialized'
      }
    }
  }
];

// Function to get a template by its ID
export function getTemplateById(id) {
  return methodTemplates.find(template => template.id === id);
}

// Function to convert a user's calculation into a new template
export function createTemplate(name, description, data) {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  
  return {
    id,
    name,
    description,
    data: {
      samplePrep: { ...data.samplePrep },
      instrumentation: { ...data.instrumentation },
      reagents: [...data.reagents],
      waste: { ...data.waste }
    }
  };
}