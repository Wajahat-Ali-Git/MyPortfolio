// =============================================================================
// Database Service
// =============================================================================
// Unified database interface supporting both Supabase and PostgreSQL
// =============================================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

let db = null;
let dbType = 'none';

// =============================================================================
// Initialize Database Connection
// =============================================================================

function initializeDatabase() {
  if (db) return { db, dbType };

  // Check for local PostgreSQL
  if (process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
    console.log('📦 Initializing PostgreSQL database connection...');
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    dbType = 'postgres';
    db = {
      pool,
      
      // Query method for raw SQL
      query: async (text, params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(text, params);
          return { rows: result.rows, error: null };
        } catch (error) {
          console.error('Database query error:', error);
          return { rows: null, error };
        } finally {
          client.release();
        }
      },

      // Supabase-like interface
      from: (table) => ({
        select: (columns = '*') => ({
          // Base select
          execute: async function() {
            return db.query(`SELECT ${columns} FROM ${table}`);
          },
          
          // With filter
          eq: function(column, value) {
            this._where = this._where || [];
            this._where.push({ column, op: '=', value });
            return this;
          },

          // Order by
          order: function(column, { ascending = true } = {}) {
            this._orderBy = `${column} ${ascending ? 'ASC' : 'DESC'}`;
            return this;
          },

          // Limit
          limit: function(count) {
            this._limit = count;
            return this;
          },

          // Single result
          single: async function() {
            this._limit = 1;
            const result = await this._buildAndExecute();
            if (result.error) return { data: null, error: result.error };
            return { data: result.rows?.[0] || null, error: null };
          },

          // Execute with all filters
          _buildAndExecute: async function() {
            let query = `SELECT ${columns} FROM ${table}`;
            const params = [];

            // WHERE clauses
            if (this._where && this._where.length > 0) {
              const whereClauses = this._where.map((w, i) => {
                params.push(w.value);
                return `${w.column} ${w.op} $${params.length}`;
              });
              query += ` WHERE ${whereClauses.join(' AND ')}`;
            }

            // ORDER BY
            if (this._orderBy) {
              query += ` ORDER BY ${this._orderBy}`;
            }

            // LIMIT
            if (this._limit) {
              query += ` LIMIT ${this._limit}`;
            }

            return db.query(query, params);
          },

          // Shorthand for execute
          then: function(resolve, reject) {
            return this._buildAndExecute().then(result => {
              if (result.error) return reject ? reject(result.error) : { data: null, error: result.error };
              return resolve({ data: result.rows, error: null });
            });
          }
        }),

        // Insert
        insert: async (data) => {
          const records = Array.isArray(data) ? data : [data];
          const client = await pool.connect();
          
          try {
            const columns = Object.keys(records[0]);
            const columnNames = columns.join(', ');
            
            const valuePlaceholders = records.map((_, recordIndex) => {
              const placeholders = columns.map((_, colIndex) => {
                return `$${recordIndex * columns.length + colIndex + 1}`;
              });
              return `(${placeholders.join(', ')})`;
            }).join(', ');

            const values = records.flatMap(record => columns.map(col => record[col]));
            
            const query = `INSERT INTO ${table} (${columnNames}) VALUES ${valuePlaceholders} RETURNING *`;
            const result = await client.query(query, values);
            
            return { data: result.rows, error: null };
          } catch (error) {
            console.error('Insert error:', error);
            return { data: null, error };
          } finally {
            client.release();
          }
        },

        // Update
        update: (updates) => ({
          eq: async (column, value) => {
            const client = await pool.connect();
            try {
              const setClause = Object.keys(updates)
                .map((key, i) => `${key} = $${i + 1}`)
                .join(', ');
              
              const values = [...Object.values(updates), value];
              const query = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${values.length} RETURNING *`;
              
              const result = await client.query(query, values);
              return { data: result.rows, error: null };
            } catch (error) {
              console.error('Update error:', error);
              return { data: null, error };
            } finally {
              client.release();
            }
          }
        }),

        // Delete
        delete: () => ({
          eq: async (column, value) => {
            const client = await pool.connect();
            try {
              const query = `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`;
              const result = await client.query(query, [value]);
              return { data: result.rows, error: null };
            } catch (error) {
              console.error('Delete error:', error);
              return { data: null, error };
            } finally {
              client.release();
            }
          }
        })
      })
    };

  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('☁️  Initializing Supabase connection...');
    dbType = 'supabase';
    db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

  } else {
    console.error('❌ ERROR: No database configured!');
    console.error('   Set either DATABASE_URL or SUPABASE credentials in .env');
    throw new Error('Database not configured');
  }

  console.log(`✅ Database initialized (${dbType})\n`);
  return { db, dbType };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get multi-language field value based on requested language
 * Falls back to English if requested language not available
 */
function getLocalizedField(record, fieldName, lang = 'en') {
  const langField = `${fieldName}_${lang}`;
  return record[langField] || record[`${fieldName}_en`] || record[fieldName] || '';
}

/**
 * Transform database record to include localized fields
 */
function localizeRecord(record, fields, lang = 'en') {
  const localized = { ...record };
  
  fields.forEach(field => {
    localized[field] = getLocalizedField(record, field, lang);
  });
  
  return localized;
}

/**
 * Parse JSONB field safely
 */
function parseJsonField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return [];
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  initializeDatabase,
  getDatabase: () => {
    if (!db) {
      return initializeDatabase();
    }
    return { db, dbType };
  },
  getLocalizedField,
  localizeRecord,
  parseJsonField
};
