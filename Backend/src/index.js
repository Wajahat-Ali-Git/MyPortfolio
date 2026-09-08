require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

// =============================================================================
// CONFIGURATION
// =============================================================================

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Database Client (Supabase or PostgreSQL)
let supabase = null;
let useLocalPostgres = false;

// Check if using local PostgreSQL via Docker
if (process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
  useLocalPostgres = true;
  console.log('Using local PostgreSQL database');
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  // Create a Supabase-like interface for PostgreSQL
  supabase = {
    from: (table) => ({
      insert: async (data) => {
        const client = await pool.connect();
        try {
          const columns = Object.keys(data[0]).join(', ');
          const values = data.map((_, i) => `($${i * Object.keys(data[0]).length + 1}:${(i + 1) * Object.keys(data[0]).length})`).join(', ');
          const flatValues = data.flatMap(obj => Object.values(obj));
          
          const query = `INSERT INTO ${table} (${columns}) VALUES ${values} RETURNING *`;
          const result = await client.query(query, flatValues);
          return { data: result.rows, error: null };
        } catch (error) {
          return { data: null, error };
        } finally {
          client.release();
        }
      },
      select: () => ({
        order: async (column, options) => {
          const client = await pool.connect();
          try {
            const order = options?.ascending ? 'ASC' : 'DESC';
            const result = await client.query(`SELECT * FROM ${table} ORDER BY ${column} ${order}`);
            return { data: result.rows, error: null };
          } catch (error) {
            return { data: null, error };
          } finally {
            client.release();
          }
        }
      })
    })
  };
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Using Supabase cloud database');
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.error('ERROR: No database configured! Set either DATABASE_URL or SUPABASE credentials.');
}

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging (development only)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// =============================================================================
// ROUTES
// =============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    supabase: process.env.SUPABASE_URL ? 'connected' : 'not configured'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      contact: 'POST /api/contact',
      messages: 'GET /api/messages (requires API key)'
    }
  });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
          ip_address: ipAddress,
          user_agent: userAgent
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save message. Please try again later.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message received successfully',
      data: {
        id: data[0].id,
        created_at: data[0].created_at
      }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all messages (protected endpoint)
app.get('/api/messages', async (req, res) => {
  try {
    // Simple API key authentication
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or missing API key'
      });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log('\n=====================================');
  console.log('  Portfolio Backend API');
  console.log('=====================================');
  console.log(`  Environment: ${NODE_ENV}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log('=====================================\n');
});

module.exports = app;
