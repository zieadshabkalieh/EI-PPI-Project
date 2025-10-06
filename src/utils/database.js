// Initialize the database
let db = null;
let localStorageFallback = false;

/**
 * Open and initialize the database with IndexedDB, with localStorage fallback
 * This ensures the application works even if IndexedDB is not available or fails
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      localStorageFallback = true;
      initLocalStorageFallback();
      resolve(null);
      return;
    }
    
    // Open database
    const request = window.indexedDB.open('EIScaleDB', 1);
    
    // Handle database upgrade (first time or version change)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create an object store for calculations
      if (!db.objectStoreNames.contains('calculations')) {
        const store = db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date', { unique: false });
      }
      
      // Create a store for templates
      if (!db.objectStoreNames.contains('templates')) {
        const templateStore = db.createObjectStore('templates', { keyPath: 'id', autoIncrement: true });
        templateStore.createIndex('name', 'name', { unique: true });
      }
    };
    
    // Handle success
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully');
      
      // Listen for connection loss
      db.onversionchange = () => {
        db.close();
        console.warn('Database was updated in another tab, please refresh');
        alert('Database was updated in another tab, please refresh this page');
      };
      
      // Test database connection
      try {
        const transaction = db.transaction(['calculations'], 'readonly');
        transaction.oncomplete = () => {
          console.log('Database connection test successful');
        };
        transaction.onerror = (error) => {
          console.error('Database connection test failed:', error);
          localStorageFallback = true;
          initLocalStorageFallback();
        };
      } catch (error) {
        console.error('Database connection test failed:', error);
        localStorageFallback = true;
        initLocalStorageFallback();
      }
      
      resolve(db);
    };
    
    // Handle error
    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      localStorageFallback = true;
      initLocalStorageFallback();
      resolve(null); // Resolve with null to continue with fallback
    };
    
    // Set timeout in case the database request hangs
    setTimeout(() => {
      if (!db) {
        console.warn('Database request timed out, falling back to localStorage');
        localStorageFallback = true;
        initLocalStorageFallback();
        resolve(null);
      }
    }, 5000);
  });
}

/**
 * Initialize localStorage fallback system
 * This imports any existing data from localStorage if needed
 */
function initLocalStorageFallback() {
  // Check if we already have calculations in localStorage
  if (!localStorage.getItem('eiCalculations')) {
    localStorage.setItem('eiCalculations', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('eiTemplates')) {
    localStorage.setItem('eiTemplates', JSON.stringify([]));
  }
  
  console.log('localStorage fallback initialized');
}

// Save a calculation to the database
export async function saveToDB(calculation) {
  try {
    if (!db) {
      db = await openDatabase();
    }
    
    // Add timestamp if not provided
    if (!calculation.date) {
      calculation.date = new Date().toISOString();
    }
    
    // If using localStorage fallback
    if (localStorageFallback) {
      return new Promise((resolve) => {
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        // Generate an ID for the calculation
        calculation.id = Date.now() + Math.floor(Math.random() * 1000);
        calculations.push(calculation);
        localStorage.setItem('eiCalculations', JSON.stringify(calculations));
        console.log('Calculation saved to localStorage fallback');
        resolve(calculation.id);
      });
    }
    
    // Using IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['calculations'], 'readwrite');
        const store = transaction.objectStore('calculations');
        
        const request = store.add(calculation);
        
        request.onsuccess = (event) => {
          console.log('Calculation saved to IndexedDB');
          resolve(event.target.result); // Returns the new ID
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB save error, falling back to localStorage');
          // Fallback to localStorage if IndexedDB fails
          localStorageFallback = true;
          const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
          calculation.id = Date.now() + Math.floor(Math.random() * 1000);
          calculations.push(calculation);
          localStorage.setItem('eiCalculations', JSON.stringify(calculations));
          resolve(calculation.id);
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction, falling back to localStorage', error);
        // Fallback to localStorage
        localStorageFallback = true;
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        calculation.id = Date.now() + Math.floor(Math.random() * 1000);
        calculations.push(calculation);
        localStorage.setItem('eiCalculations', JSON.stringify(calculations));
        resolve(calculation.id);
      }
    });
  } catch (error) {
    console.error('Error saving to database, trying localStorage fallback:', error);
    // Final fallback if the entire try block fails
    try {
      localStorageFallback = true;
      const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
      calculation.id = Date.now() + Math.floor(Math.random() * 1000);
      calculations.push(calculation);
      localStorage.setItem('eiCalculations', JSON.stringify(calculations));
      return calculation.id;
    } catch (lsError) {
      console.error('All storage methods failed:', lsError);
      // Create in-memory storage as last resort
      if (!window.inMemoryCalculations) {
        window.inMemoryCalculations = [];
      }
      calculation.id = Date.now() + Math.floor(Math.random() * 1000);
      window.inMemoryCalculations.push(calculation);
      return calculation.id;
    }
  }
}

// Get all calculations from the database
export async function getCalculations() {
  try {
    if (!db) {
      db = await openDatabase();
    }
    
    // If using localStorage fallback
    if (localStorageFallback) {
      return new Promise((resolve) => {
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        // Sort by date in reverse order (newest first)
        calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log('Calculations retrieved from localStorage fallback');
        resolve(calculations);
      });
    }
    
    // Using IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['calculations'], 'readonly');
        const store = transaction.objectStore('calculations');
        const index = store.index('date');
        
        const request = index.openCursor(null, 'prev'); // Get in reverse chronological order
        const calculations = [];
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            calculations.push(cursor.value);
            cursor.continue();
          } else {
            console.log('Calculations retrieved from IndexedDB');
            resolve(calculations);
          }
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB retrieval error, falling back to localStorage');
          // Fallback to localStorage if IndexedDB fails
          localStorageFallback = true;
          const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
          calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
          resolve(calculations);
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction, falling back to localStorage', error);
        // Fallback to localStorage
        localStorageFallback = true;
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(calculations);
      }
    });
  } catch (error) {
    console.error('Error getting calculations, trying localStorage fallback:', error);
    // Final fallback if the entire try block fails
    try {
      localStorageFallback = true;
      const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
      calculations.sort((a, b) => new Date(b.date) - new Date(a.date));
      return calculations;
    } catch (lsError) {
      console.error('All storage methods failed:', lsError);
      // Return in-memory storage if it exists
      return window.inMemoryCalculations || [];
    }
  }
}

// Get a specific calculation by ID
export async function getCalculationById(id) {
  try {
    if (!db) {
      db = await openDatabase();
    }
    
    // Convert ID to number if it's a string (needed for comparison)
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    
    // If using localStorage fallback
    if (localStorageFallback) {
      return new Promise((resolve) => {
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        const calculation = calculations.find(calc => calc.id === id);
        console.log('Calculation retrieved from localStorage fallback');
        resolve(calculation || null);
      });
    }
    
    // Using IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['calculations'], 'readonly');
        const store = transaction.objectStore('calculations');
        
        const request = store.get(id);
        
        request.onsuccess = (event) => {
          console.log('Calculation retrieved from IndexedDB');
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB retrieval error, falling back to localStorage');
          // Fallback to localStorage if IndexedDB fails
          localStorageFallback = true;
          const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
          const calculation = calculations.find(calc => calc.id === id);
          resolve(calculation || null);
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction, falling back to localStorage', error);
        // Fallback to localStorage
        localStorageFallback = true;
        const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        const calculation = calculations.find(calc => calc.id === id);
        resolve(calculation || null);
      }
    });
  } catch (error) {
    console.error('Error getting calculation, trying localStorage fallback:', error);
    // Final fallback if the entire try block fails
    try {
      localStorageFallback = true;
      const calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
      const calculation = calculations.find(calc => calc.id === id);
      return calculation || null;
    } catch (lsError) {
      console.error('All storage methods failed:', lsError);
      // Check in-memory storage if it exists
      return window.inMemoryCalculations ? 
        window.inMemoryCalculations.find(calc => calc.id === id) : 
        null;
    }
  }
}

// Delete a calculation by ID
export async function deleteCalculation(id) {
  try {
    if (!db) {
      db = await openDatabase();
    }
    
    // Convert ID to number if it's a string (needed for comparison)
    if (typeof id === 'string') {
      id = parseInt(id, 10);
    }
    
    // If using localStorage fallback
    if (localStorageFallback) {
      return new Promise((resolve) => {
        let calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        calculations = calculations.filter(calc => calc.id !== id);
        localStorage.setItem('eiCalculations', JSON.stringify(calculations));
        console.log('Calculation deleted from localStorage fallback');
        resolve(true);
      });
    }
    
    // Using IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(['calculations'], 'readwrite');
        const store = transaction.objectStore('calculations');
        
        const request = store.delete(id);
        
        request.onsuccess = (event) => {
          console.log('Calculation deleted from IndexedDB');
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB delete error, falling back to localStorage');
          // Fallback to localStorage if IndexedDB fails
          localStorageFallback = true;
          let calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
          calculations = calculations.filter(calc => calc.id !== id);
          localStorage.setItem('eiCalculations', JSON.stringify(calculations));
          resolve(true);
        };
      } catch (error) {
        console.error('Error in IndexedDB transaction, falling back to localStorage', error);
        // Fallback to localStorage
        localStorageFallback = true;
        let calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
        calculations = calculations.filter(calc => calc.id !== id);
        localStorage.setItem('eiCalculations', JSON.stringify(calculations));
        resolve(true);
      }
    });
  } catch (error) {
    console.error('Error deleting calculation, trying localStorage fallback:', error);
    // Final fallback if the entire try block fails
    try {
      localStorageFallback = true;
      let calculations = JSON.parse(localStorage.getItem('eiCalculations') || '[]');
      calculations = calculations.filter(calc => calc.id !== id);
      localStorage.setItem('eiCalculations', JSON.stringify(calculations));
      return true;
    } catch (lsError) {
      console.error('All storage methods failed:', lsError);
      // Remove from in-memory storage if it exists
      if (window.inMemoryCalculations) {
        window.inMemoryCalculations = window.inMemoryCalculations.filter(calc => calc.id !== id);
      }
      return true;
    }
  }
}
