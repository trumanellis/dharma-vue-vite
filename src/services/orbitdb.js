/**
 * Get all user profiles
 */
export const getAllUserProfiles = async () => {
  if (!userProfileDb) {
    await initOrbitDB();
  }
  
  try {
    return await userProfileDb.all();
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
};// Expanded mock task data with tasks for both users
const mockTasks = [
  // User 1 tasks
  {
    _id: 'task1',
    title: 'Dawn Water Blessing Ceremony',
    description: `Conduct the monthly dawn water blessing ceremony at Eagle Creek. This ceremony acknowledges the sacredness of water and our responsibility as stewards. The ritual involves:

1. Arriving before sunrise (around 5:30 AM) to prepare the space
2. Setting up the circle of stones and placing the seven ceremonial vessels
3. Leading the group in the water gratitude chant
4. Guiding the blessing of the watershed map
5. Facilitating individual water offerings and intentions

This ceremony is essential for maintaining our connection to the watershed and reinforcing our collective commitment to its protection. Please document any dreams or visions that arise during the ceremony, as these often contain guidance for our conservation work.`,
    status: 'Pending',
    created_at: Date.now() - 86400000, // 1 day ago
    updated_at: Date.now() - 86400000,
    gratitude: 78,
    attention_time: 0, // Not yet started
    aliases: ['Water Ceremony', 'Dawn Ritual', 'Eagle Creek Blessing'],
    author_id: 'user1',
    source_id: null,
    priority: 'High',
    category: 'Ceremony',
    location: 'Eagle Creek Watershed',
    participants: ['user2', 'community']
  },
  {
    _id: 'task2',
    title: 'Plant Sacred Medicine Garden',
    description: `Establish the new medicine garden in the eastern section of the community land. This garden will serve as both a teaching space and a source of healing plants for ceremonies and community care.

Key components of this task:
• Prepare the soil using the no-till method with sheet mulching
• Create the sacred geometry pattern using stones to mark the seven sections
• Plant the cardinal direction indicators (tobacco, cedar, sweetgrass, sage)
• Install the central stone altar for offerings
• Add plant identification markers with both scientific and traditional names
• Perform the garden blessing with the seed songs

The garden should follow the traditional mandala pattern, with concentric circles designating plants by use (teas, poultices, tinctures, ceremonial). Use only heirloom seeds from our seed bank, particularly those gifted from elder White Otter during last year's gathering.`,
    status: 'InProgress',
    created_at: Date.now() - 172800000, // 2 days ago
    updated_at: Date.now() - 43200000, // 12 hours ago
    gratitude: 143,
    attention_time: 8640, // 2.4 hours in seconds
    aliases: ['Medicine Wheel Garden', 'Healing Plants', 'Teaching Garden'],
    author_id: 'user1',
    source_id: null,
    priority: 'Medium',
    category: 'Earth Regeneration',
    location: 'Community Land - Eastern Field',
    participants: ['user1', 'community']
  },
  {
    _id: 'task3',
    title: 'Daily Sunrise Meditation Practice',
    description: `Maintain the daily sunrise meditation practice focused on the element of air for this lunar cycle. This practice is part of our temple's commitment to moving through the elemental attunements throughout the year.

The practice follows this sequence:
1. 10 minutes of breath awareness meditation
2. 15 minutes of prayer-infused breath work (using the 4-7-8 temple rhythm)
3. 15 minutes of silent sitting
4. 10 minutes of gratitude practice
5. Recording insights in the Elements journal

This practice should be done facing east, ideally in the same location each day. The current focus is on how air connects all beings through the shared breath, and how our personal healing extends to planetary healing through this medium.

During the last quarter of the moon phase (next 7 days), pay special attention to dreams related to birds, wind, or smoke, as these are traditional messengers of air wisdom.`,
    status: 'Completed',
    created_at: Date.now() - 259200000, // 3 days ago
    updated_at: Date.now() - 21600000, // 6 hours ago
    gratitude: 89,
    attention_time: 10800, // 3 hours in seconds
    aliases: ['Air Element Practice', 'Morning Meditation', 'Breath Work'],
    author_id: 'user1',
    source_id: null,
    priority: 'High',
    category: 'Spiritual Practice',
    location: 'Personal Meditation Space',
    participants: ['user1'],
    reflections: "The practice is deepening my understanding of interdependence. Today's sitting revealed the pattern of thought as clouds passing through awareness."
  },
  // User 2 tasks
  {
    _id: 'task4',
    title: 'Bioregional Seed Inventory',
    description: `Complete the seasonal inventory of our bioregional seed bank, with special attention to drought-resistant varieties. This inventory is crucial for our seed sovereignty program and community resilience planning.

The process includes:
• Checking each seed variety for viability and quantity
• Updating digital records with germination test results
• Identifying varieties needing renewal through cultivation this season
• Documenting traditional stories and growing instructions for each variety
• Preparing seed packets for the upcoming community exchange

Focus particularly on the heritage corn, bean, and squash varieties from the Three Sisters collection. We need to ensure we have sufficient quantities for both cultivation and ceremonial use in the autumn harvest rituals.

The inventory must be conducted with proper reverence, acknowledging each seed family as a living relative with its own spirit and medicine. Use the traditional songs when opening and closing each seed container, and burn the cedar offering before beginning the work.`,
    status: 'InProgress',
    created_at: Date.now() - 129600000, // 1.5 days ago
    updated_at: Date.now() - 43200000, // 12 hours ago
    gratitude: 167,
    attention_time: 18000, // 5 hours in seconds
    aliases: ['Seed Sovereignty', 'Heritage Seeds', 'Food Security'],
    author_id: 'user2',
    source_id: null,
    priority: 'High',
    category: 'Food Systems',
    location: 'Community Seed Bank',
    participants: ['user2', 'apprentices']
  },
  {
    _id: 'task5',
    title: 'Traditional Fire Tending Workshop',
    description: `Prepare and facilitate the traditional fire tending workshop for the new community members. This workshop is an essential initiation into our community's relationship with the element of fire and our responsibilities as fire keepers.

The workshop will cover:
• The spiritual significance of fire in our tradition
• Proper protocols for starting, maintaining, and extinguishing sacred fires
• The different types of ceremonial fires (sweat lodge, council fire, hearth fire)
• Songs and prayers associated with fire tending
• Sustainable wood harvesting practices
• Fire safety and emergency protocols

Materials needed:
• Hand-carved fire-starting kits for each participant (cedar base, yucca drill, stone socket)
• The seven sacred woods bundle for demonstration
• Fire keeper's journal for each participant
• Traditional fire-tending tools (oak poker, juniper brush, abalone shell)

Before the workshop, spend at least one night in solitary fire vigil to receive guidance on what specific teachings should be emphasized for this particular group of apprentices.`,
    status: 'Pending',
    created_at: Date.now() - 345600000, // 4 days ago
    updated_at: Date.now() - 172800000, // 2 days ago
    gratitude: 112,
    attention_time: 0,
    aliases: ['Fire Wisdom', 'Ceremony Training', 'Traditional Skills'],
    author_id: 'user2',
    source_id: null,
    priority: 'Medium',
    category: 'Education',
    location: 'Sacred Fire Circle',
    participants: ['user2', 'new members']
  },
  // Shared/Community Tasks
  {
    _id: 'task6',
    title: 'Full Moon Water Blessing Ceremony',
    description: `Coordinate and lead the monthly full moon water blessing ceremony at the community pond. This ceremony aligns our community with lunar cycles and deepens our commitment to water protection.

Ceremonial sequence:
1. Opening the circle with the Four Directions invocation
2. Lighting the central candle and water crystal activation
3. Leading the water gratitude song cycle (all 7 verses)
4. Facilitating the sharing of water stories and commitments
5. Conducting the water offering ritual with the sacred vessel
6. Guiding the collective prayer for water bodies worldwide
7. Closing the circle with the spiral dance

Preparation requires gathering fresh flowers, preparing the blessing herbs (lavender, rose, cedar), and ensuring the ceremonial vessels are ritually cleaned. The main altar should be arranged according to the traditional pattern with the blue cloth, abalone shells, and moon stones in the correct configuration.

Special attention for this month: The full moon falls in Scorpio, emphasizing themes of emotional purification and ancestral healing. Incorporate the ancestral water healing prayer, and bring the three generations photograph for the ancestor portion of the altar.`,
    status: 'Pending',
    created_at: Date.now() - 518400000, // 6 days ago
    updated_at: Date.now() - 259200000, // 3 days ago
    gratitude: 215,
    attention_time: 0,
    aliases: ['Moon Ceremony', 'Water Blessing', 'Community Ritual'],
    author_id: 'user1',
    source_id: null,
    priority: 'High',
    category: 'Ceremony',
    location: 'Community Pond',
    participants: ['user1', 'user2', 'community'],
    stewardship_transfers: [
      {
        previous_steward_id: 'user2',
        new_steward_id: 'user1',
        timestamp: Date.now() - 345600000, // 4 days ago
        reason: "Amara's deeper connection with water ceremonies and moon cycles makes her the ideal steward for this particular ritual."
      }
    ]
  },
  // Child task with lineage
  {
    _id: 'task7',
    title: 'Harvest Ceremonial Herbs for Altar',
    description: `Harvest the specific herbs needed for the sunrise meditation altar. This is a supporting task for the daily meditation practice.

Herbs to gather:
• White sage (7 sprigs) from the eastern garden
• Lavender (12 stems) from the medicine wheel
• Rosemary (3 sprigs) from the kitchen garden
• Cedar (small handful) from the elder tree by the creek

These plants should be harvested at dawn with the appropriate prayers offered to each plant being gathered. Use the copper scissors for cutting, and wrap each herb separately in natural fiber cloth.

Follow the traditional harvesting protocols:
1. Approach each plant from the east
2. Offer tobacco or cornmeal before harvesting
3. Take only what is needed, never more than 1/3 of the plant
4. Express gratitude specifically naming the medicine each plant brings
5. Leave the bundle by the meditation cushion before the morning practice

This task supports the medicine of clear thinking and spiritual protection during the air element practices.`,
    status: 'Completed',
    created_at: Date.now() - 64800000, // 18 hours ago
    updated_at: Date.now() - 21600000, // 6 hours ago
    gratitude: 45,
    attention_time: 3600, // 1 hour in seconds
    aliases: ['Altar Herbs', 'Medicine Gathering', 'Ceremonial Plants'],
    author_id: 'user1',
    source_id: 'task3',  // This is a child task of the morning meditation
    priority: 'Medium',
    category: 'Preparation',
    location: 'Medicine Gardens',
    participants: ['user1']
  }
];// File: src/services/orbitdb.js

import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { LevelBlockstore } from 'blockstore-level'
import { createOrbitDB, IPFSAccessController } from '@orbitdb/core'
import { createIndexedDBStore } from './indexeddb-store'

// Singleton pattern
let orbitdb = null;
let taskDb = null;
let userProfileDb = null;
let initializationInProgress = false;
let initializationPromise = null;

// Database prefix for namespacing
const DB_PREFIX = 'dharma-task-manager';

// Mock data for fallback and initial population
const mockUsers = [
  {
    _id: 'user1',
    name: 'Amara Lee',
    aliases: ['Forest Guardian', 'Water Protector'],
    profile_data: {
      bio: 'Devoted practitioner of earth-based spirituality and regenerative permaculture. I believe in the sacred connection between humans and the natural world. My dharma path involves restoring watersheds and traditional plant knowledge.',
      avatar: '',
      location: 'Pacific Northwest',
      practices: ['Meditation', 'Permaculture', 'Herbalism', 'Water Ceremonies'],
      temples: ['Água Lila', 'Terra Nova']
    },
    total_gratitude: 347,
    created_at: Date.now() - 2592000000, // 30 days ago
    updated_at: Date.now() - 86400000
  },
  {
    _id: 'user2',
    name: 'Rohan Patel',
    aliases: ['Seed Keeper', 'Fire Tender'],
    profile_data: {
      bio: 'Traditional ecologist working with indigenous communities to preserve sacred seed lineages. My spiritual practice merges ancient farming wisdom with modern regenerative techniques. I protect biodiversity as an act of devotion.',
      avatar: '',
      location: 'Southwestern Mountains',
      practices: ['Seed Saving', 'Traditional Farming', 'Fire Ceremonies', 'Sacred Economics'],
      temples: ['Terra Nova', 'Mountain Haven Sanctuary']
    },
    total_gratitude: 415,
    created_at: Date.now() - 3456000000, // 40 days ago
    updated_at: Date.now() - 172800000 // 2 days ago
  }
];

/**
 * Update the loading step and dispatch an event
 */
const updateLoadingStep = (step) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('orbitdb-loading-step', { 
      detail: { step } 
    }));
  }
};

/**
 * Get the optimal Libp2p configuration for browser environments
 */
const getLibp2pConfig = () => {
  return {
    // Use WebSockets as the transport - works in browsers
    transports: [webSockets()],
    
    // Connection encryption
    connectionEncryption: [noise()],
    
    // Stream multiplexing
    streamMuxers: [yamux()],
    
    // Peer discovery and identification
    services: {
      identify: identify(),
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
        emitSelf: true
      })
    },
    
    // Disable automatic discovery for simplicity
    peerDiscovery: [],
    
    // Avoid connection errors by setting minimum to 0
    connectionManager: {
      minConnections: 0,
      maxConnections: 100
    }
  };
};

/**
 * Initialize the IPFS node (Helia)
 */
const initializeIPFS = async () => {
  try {
    console.log('Initializing IPFS with Helia...');
    updateLoadingStep(1);
    
    // Create Libp2p with our configuration
    const libp2p = await createLibp2p(getLibp2pConfig());
    
    // Use LevelDB-based blockstore for persistent storage
    // Use a prefix for the OrbitDB application to avoid conflicts
    let blockstore;
    
    // Use IndexedDB in browser environments, LevelDB in Node.js
    if (typeof window !== 'undefined') {
      blockstore = createIndexedDBStore(`${DB_PREFIX}-blocks`);
    } else {
      blockstore = new LevelBlockstore(`./${DB_PREFIX}/ipfs/blocks`);
    }
    
    // Create and return the IPFS node
    const ipfs = await createHelia({
      libp2p,
      blockstore
    });
    
    console.log('IPFS node initialized successfully');
    return ipfs;
  } catch (error) {
    console.error('Failed to initialize IPFS:', error);
    throw new Error(`IPFS initialization failed: ${error.message}`);
  }
};

/**
 * Create OrbitDB instance with the given IPFS node
 */
const createOrbitDBInstance = async (ipfs) => {
  try {
    console.log('Creating OrbitDB instance...');
    updateLoadingStep(2);
    
    // Ensure we have a directory for persistency
    const directory = typeof window !== 'undefined' ? 
      undefined : // Browser IndexedDB will handle this
      `./${DB_PREFIX}/orbitdb`;
    
    // Create OrbitDB instance with our configuration
    const orbitInstance = await createOrbitDB({
      ipfs,
      directory,
      // Set to false for proper persistence
      offline: false
    });
    
    console.log('OrbitDB initialized:', orbitInstance.identity.id);
    return orbitInstance;
  } catch (error) {
    console.error('Failed to create OrbitDB instance:', error);
    throw new Error(`OrbitDB initialization failed: ${error.message}`);
  }
};

/**
 * Open a database with the given name and type
 */
const openDatabase = async (orbitInstance, dbName, dbType) => {
  try {
    console.log(`Opening ${dbType} database: ${dbName}...`);
    updateLoadingStep(3);
    
    // Open the database with public write access for simplicity
    // Use a consistent database name across sessions for persistence
    const db = await orbitInstance.open(`${DB_PREFIX}.${dbName}`, {
      type: dbType,
      AccessController: IPFSAccessController({ write: ['*'] }),
      // Enable caching for better performance
      cache: true,
      // Enable local persistence
      localOnly: false
    });
    
    console.log(`Database opened at: ${db.address.toString()}`);
    return db;
  } catch (error) {
    console.error(`Failed to open ${dbName} database:`, error);
    throw new Error(`Database opening failed: ${error.message}`);
  }
};

/**
 * Initialize databases with sample data if they're empty
 * This ensures we always have data in our databases, even on first run
 */
const initializeWithSampleData = async () => {
  try {
    updateLoadingStep(4);
    
    // Ensure all users exist
    console.log('Initializing user profiles...');
    for (const user of mockUsers) {
      try {
        // Check if this user exists
        const existingUser = await userProfileDb.get(user._id);
        
        if (!existingUser) {
          // Add the user if they don't exist
          console.log(`Adding user profile: ${user.name} (${user._id})`);
          await userProfileDb.put(user);
        } else {
          console.log(`User ${user.name} already exists`);
        }
      } catch (err) {
        console.error(`Error adding user ${user._id}:`, err);
      }
    }
    
    // Ensure all tasks exist
    console.log('Initializing tasks...');
    
    // Get existing tasks to avoid duplication
    const existingTasks = await taskDb.all();
    const existingTaskIds = existingTasks.map(t => t._id);
    console.log(`Found ${existingTasks.length} existing tasks`);
    
    // Add any missing tasks
    for (const task of mockTasks) {
      if (!existingTaskIds.includes(task._id)) {
        try {
          console.log(`Adding task: ${task.title} (${task._id})`);
          await taskDb.put(task);
        } catch (err) {
          console.error(`Failed to add task ${task.title}:`, err);
        }
      } else {
        console.log(`Task ${task.title} already exists`);
      }
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing with sample data:', error);
    throw error;
  }
};

/**
 * Register event listeners for databases
 */
const registerEventListeners = () => {
  if (!taskDb || !userProfileDb) return;
  
  // Task database events
  taskDb.events.on('update', async (entry) => {
    console.log('Task database updated:', entry.payload.key);
  });
  
  taskDb.events.on('replicated', () => {
    console.log('Task database replicated with peer');
  });
  
  // User profile database events
  userProfileDb.events.on('update', async (entry) => {
    console.log('User profile database updated:', entry.payload.key);
  });
  
  // Peer connection events
  taskDb.events.on('join', (peerId) => {
    console.log(`Peer ${peerId} joined`);
  });
};

/**
 * Main initialization function for OrbitDB
 */
export const initOrbitDB = async () => {
  try {
    // If already initialized, return existing instances
    if (orbitdb) {
      console.log('OrbitDB already initialized, reusing instance');
      return { orbitdb, taskDb, userProfileDb };
    }
    
    // If initialization is already in progress, wait for it
    if (initializationInProgress) {
      console.log('OrbitDB initialization in progress, waiting...');
      return initializationPromise;
    }
    
    // Set initialization flag
    initializationInProgress = true;
    
    // Setup initialization promise
    initializationPromise = (async () => {
      try {
        // Step 1: Initialize IPFS
        const ipfs = await initializeIPFS();
        
        // Step 2: Create OrbitDB instance
        orbitdb = await createOrbitDBInstance(ipfs);
        
        // Step 3: Open databases
        taskDb = await openDatabase(orbitdb, 'tasks', 'documents');
        userProfileDb = await openDatabase(orbitdb, 'profiles', 'documents');
        
        // Step 4: Setup event listeners
        registerEventListeners();
        
        // Step 5: Initialize with sample data if needed
        await initializeWithSampleData();
        
        // Initialization complete
        initializationInProgress = false;
        return { orbitdb, taskDb, userProfileDb };
      } catch (error) {
        // Handle initialization errors
        console.error('Error during OrbitDB initialization:', error);
        
        // Cleanup any partially initialized resources
        if (taskDb) await taskDb.close().catch(() => {});
        if (userProfileDb) await userProfileDb.close().catch(() => {});
        if (orbitdb) await orbitdb.stop().catch(() => {});
        
        // Reset state
        orbitdb = null;
        taskDb = null;
        userProfileDb = null;
        initializationInProgress = false;
        
        // Fallback to mock databases
        console.log('Falling back to mock databases');
        orbitdb = { identity: { id: 'user1' }, stop: async () => {} };
        taskDb = createMockTaskDb();
        userProfileDb = createMockUserProfileDb();
        
        return { orbitdb, taskDb, userProfileDb };
      }
    })();
    
    return initializationPromise;
  } catch (error) {
    console.error('Error in initOrbitDB:', error);
    initializationInProgress = false;
    
    // Emergency fallback
    console.log('Using emergency mock OrbitDB');
    orbitdb = { identity: { id: 'user1' }, stop: async () => {} };
    taskDb = createMockTaskDb();
    userProfileDb = createMockUserProfileDb();
    
    return { orbitdb, taskDb, userProfileDb };
  }
};

/**
 * Close OrbitDB and its databases
 */
export const closeOrbitDB = async () => {
  try {
    if (taskDb) await taskDb.close();
    if (userProfileDb) await userProfileDb.close();
    if (orbitdb) await orbitdb.stop();
    
    taskDb = null;
    userProfileDb = null;
    orbitdb = null;
    
    console.log('OrbitDB closed successfully');
  } catch (error) {
    console.error('Error closing OrbitDB:', error);
  }
};

/**
 * Create a mock task database for fallback
 */
const createMockTaskDb = () => {
  let tasks = [...mockTasks];
  
  return {
    address: { toString: () => '/orbitdb/mock-tasks-db' },
    all: async () => tasks,
    get: async (id) => tasks.find(task => task._id === id),
    put: async (task) => {
      const index = tasks.findIndex(t => t._id === task._id);
      if (index >= 0) {
        tasks[index] = { ...task, updated_at: Date.now() };
      } else {
        tasks.push({ ...task, _id: task._id || `task${tasks.length + 1}`, created_at: Date.now(), updated_at: Date.now() });
      }
      return 'mock-hash';
    },
    del: async (id) => {
      tasks = tasks.filter(task => task._id !== id);
      return 'mock-hash';
    },
    close: async () => {},
    events: {
      on: (event, callback) => {}
    }
  };
};

/**
 * Create a mock user profile database for fallback
 */
const createMockUserProfileDb = () => {
  let profiles = [...mockUsers];
  
  return {
    address: { toString: () => '/orbitdb/mock-profiles-db' },
    all: async () => profiles,
    get: async (id) => profiles.find(profile => profile._id === id),
    put: async (profile) => {
      const index = profiles.findIndex(p => p._id === profile._id);
      if (index >= 0) {
        profiles[index] = { ...profile, updated_at: Date.now() };
      } else {
        profiles.push({ ...profile, created_at: Date.now(), updated_at: Date.now() });
      }
      return 'mock-hash';
    },
    close: async () => {},
    events: {
      on: (event, callback) => {}
    }
  };
};

// Task-related functions
export const getTasks = async () => {
  if (!taskDb) {
    await initOrbitDB();
  }
  
  try {
    const allDocs = await taskDb.all();
    return allDocs;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const addTask = async (task) => {
  if (!taskDb) {
    await initOrbitDB();
  }
  
  try {
    const taskWithMeta = {
      ...task,
      created_at: Date.now(),
      status: task.status || 'Pending',
      attention_time: 0,
      stewardship_transfers: []
    };
    
    const hash = await taskDb.put(taskWithMeta);
    console.log('Task added with hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (task) => {
  if (!taskDb) {
    await initOrbitDB();
  }
  
  try {
    const existingTask = task._id ? (await taskDb.get(task._id)) : null;
    
    const updatedTask = {
      ...task,
      updated_at: Date.now(),
      created_at: existingTask?.created_at || task.created_at || Date.now()
    };
    
    const hash = await taskDb.put(updatedTask);
    console.log('Task updated with hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  if (!taskDb) {
    await initOrbitDB();
  }
  
  try {
    const hash = await taskDb.del(taskId);
    console.log('Task deleted with hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// User profile functions
export const getUserProfile = async (userId) => {
  if (!userProfileDb) {
    await initOrbitDB();
  }
  
  try {
    return await userProfileDb.get(userId);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profile) => {
  if (!userProfileDb) {
    await initOrbitDB();
  }
  
  try {
    const hash = await userProfileDb.put(profile);
    console.log('Profile updated with hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
