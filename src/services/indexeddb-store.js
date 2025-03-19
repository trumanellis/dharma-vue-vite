// File: src/services/indexeddb-store.js
// A wrapper for IndexedDB to use as a blockstore for Helia

/**
 * Creates an IndexedDB blockstore compatible with Helia
 * 
 * @param {string} name The name of the IndexedDB database
 * @returns {Object} A blockstore implementation
 */
export const createIndexedDBStore = (name = 'dharma-ipfs-blocks') => {
  // Open IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(name, 1);
      
      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject(new Error('Failed to open IndexedDB'));
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('blocks')) {
          db.createObjectStore('blocks');
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
    });
  };
  
  // Get a transaction
  const getTransaction = async (mode = 'readonly') => {
    const db = await openDB();
    return db.transaction(['blocks'], mode);
  };
  
  // Get object store
  const getStore = async (mode = 'readonly') => {
    const tx = await getTransaction(mode);
    return tx.objectStore('blocks');
  };
  
  return {
    /**
     * Store a block
     * 
     * @param {CID} cid The content identifier
     * @param {Uint8Array} block The block data
     */
    put: async (cid, block) => {
      const key = cid.toString();
      const store = await getStore('readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.put(block, key);
        
        request.onsuccess = () => resolve(cid);
        request.onerror = (event) => {
          console.error('Error storing block:', event);
          reject(new Error(`Failed to store block: ${key}`));
        };
      });
    },
    
    /**
     * Retrieve a block
     * 
     * @param {CID} cid The content identifier
     * @returns {Uint8Array} The block data
     */
    get: async (cid) => {
      const key = cid.toString();
      const store = await getStore();
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = (event) => {
          if (event.target.result) {
            resolve(event.target.result);
          } else {
            reject(new Error(`Block not found: ${key}`));
          }
        };
        
        request.onerror = (event) => {
          console.error('Error retrieving block:', event);
          reject(new Error(`Failed to retrieve block: ${key}`));
        };
      });
    },
    
    /**
     * Check if a block exists
     * 
     * @param {CID} cid The content identifier
     * @returns {boolean} Whether the block exists
     */
    has: async (cid) => {
      try {
        const key = cid.toString();
        const store = await getStore();
        
        return new Promise((resolve) => {
          const request = store.count(key);
          
          request.onsuccess = (event) => {
            resolve(event.target.result > 0);
          };
          
          request.onerror = () => {
            resolve(false);
          };
        });
      } catch (err) {
        return false;
      }
    },
    
    /**
     * Delete a block
     * 
     * @param {CID} cid The content identifier
     */
    delete: async (cid) => {
      const key = cid.toString();
      const store = await getStore('readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error('Error deleting block:', event);
          reject(new Error(`Failed to delete block: ${key}`));
        };
      });
    },
    
    /**
     * Close the blockstore
     */
    close: async () => {
      // IndexedDB connections are automatically closed
    }
  };
};
