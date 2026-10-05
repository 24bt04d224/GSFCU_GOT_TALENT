/**
 * GSFCU Got Talent 2026 - Production Backend Server
 * Compatible with Render.com, Railway, Fly.io, and Localhost
 * Built using Node.js standard library (Zero external dependencies required)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure database directory & storage file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_DB = {
  registrations: [],
  sponsors: [],
  stats: {
    views: 0,
    lastUpdated: new Date().toISOString()
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Database Error] Failed to read db.json:', err.message);
    return DEFAULT_DB;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Database Error] Failed to write db.json:', err.message);
    return false;
  }
}

// CORS & JSON helpers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // 10MB limit
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// MIME types for static frontend serving
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  // API ROUTING
  // 1. Health check
  if (pathname === '/health' || pathname === '/api/health') {
    const db = readDb();
    return sendJson(res, 200, {
      status: 'ok',
      service: 'GSFCU Got Talent Render Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      counts: {
        registrations: db.registrations.length,
        sponsors: db.sponsors.length
      }
    });
  }

  // 2. Registrations: GET all
  if (pathname === '/api/registrations' && method === 'GET') {
    const db = readDb();
    return sendJson(res, 200, {
      success: true,
      data: db.registrations,
      count: db.registrations.length
    });
  }

  // 3. Registrations: POST new registration
  if ((pathname === '/api/registrations' || pathname === '/api/register') && method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      if (!payload.fullName || !payload.enrollmentNo || !payload.category) {
        return sendJson(res, 400, {
          success: false,
          error: 'Required fields missing: fullName, enrollmentNo, category'
        });
      }

      const db = readDb();
      const newId = payload.id || `GT26-${Math.floor(1000 + Math.random() * 9000)}`;
      const registration = {
        ...payload,
        id: newId,
        registeredAt: payload.registeredAt || new Date().toISOString(),
        status: payload.status || 'Registered',
        checkedIn: Boolean(payload.checkedIn),
        checkInTime: payload.checkInTime || null
      };

      // Check for duplicate ID or overwrite
      const existingIdx = db.registrations.findIndex(r => r.id === newId);
      if (existingIdx >= 0) {
        db.registrations[existingIdx] = registration;
      } else {
        db.registrations.unshift(registration);
      }

      writeDb(db);
      return sendJson(res, 201, {
        success: true,
        message: 'Registration saved successfully',
        data: registration
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 4. Registrations: Check-in endpoint POST /api/check-in or /api/registrations/:id/checkin
  if ((pathname === '/api/check-in' || pathname === '/api/registrations/check-in') && method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const queryId = (payload.id || payload.enrollmentNo || '').trim().toUpperCase();

      if (!queryId) {
        return sendJson(res, 400, { success: false, error: 'Registration ID or Enrollment No required' });
      }

      const db = readDb();
      const target = db.registrations.find(r => 
        (r.id && r.id.toUpperCase() === queryId) || 
        (r.enrollmentNo && r.enrollmentNo.toUpperCase() === queryId)
      );

      if (!target) {
        return sendJson(res, 404, { success: false, error: 'Participant record not found' });
      }

      const now = new Date().toISOString();
      target.checkedIn = true;
      target.checkInTime = target.checkInTime || now;
      target.status = target.status === 'Cancelled' ? 'Cancelled' : 'Auditioned';

      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        message: 'Participant checked in successfully',
        data: target
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 5. Registrations: PUT / PATCH update by ID (/api/registrations/:id)
  const regIdMatch = pathname.match(/^\/api\/registrations\/([^/]+)$/);
  if (regIdMatch && (method === 'PUT' || method === 'PATCH')) {
    try {
      const targetId = decodeURIComponent(regIdMatch[1]);
      const updates = await parseJsonBody(req);
      const db = readDb();
      const index = db.registrations.findIndex(r => r.id === targetId);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: 'Registration not found' });
      }

      db.registrations[index] = {
        ...db.registrations[index],
        ...updates,
        id: targetId // protect primary ID
      };

      writeDb(db);
      return sendJson(res, 200, {
        success: true,
        message: 'Registration updated',
        data: db.registrations[index]
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 6. Sponsors: GET & POST
  if (pathname === '/api/sponsors') {
    const db = readDb();
    if (method === 'GET') {
      return sendJson(res, 200, { success: true, data: db.sponsors || [] });
    }
    if (method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const newSponsor = {
          id: `SP-${Date.now()}`,
          name: body.name || 'Anonymous Sponsor',
          tier: body.tier || 'Silver',
          logoUrl: body.logoUrl || '',
          website: body.website || '',
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        db.sponsors = db.sponsors || [];
        db.sponsors.push(newSponsor);
        writeDb(db);
        return sendJson(res, 201, { success: true, data: newSponsor });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: err.message });
      }
    }
  }

  // 7. Stats: GET /api/stats
  if (pathname === '/api/stats' && method === 'GET') {
    const db = readDb();
    const regs = db.registrations;
    const total = regs.length;
    const checkedIn = regs.filter(r => r.checkedIn).length;
    const solo = regs.filter(r => (r.participationType || '').toLowerCase() === 'solo').length;
    const group = total - solo;

    return sendJson(res, 200, {
      success: true,
      stats: {
        total,
        checkedIn,
        solo,
        group,
        sponsors: (db.sponsors || []).length
      }
    });
  }

  // 8. Serve static frontend files if dist/ exists (Fullstack Render Deployment)
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
    
    // Normalize path to prevent directory traversal
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback: return index.html for client-side routing
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  // Not found fallback
  return sendJson(res, 404, {
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET  /health',
      'GET  /api/health',
      'GET  /api/registrations',
      'POST /api/registrations',
      'POST /api/check-in',
      'PUT  /api/registrations/:id',
      'GET  /api/stats',
      'GET  /api/sponsors'
    ]
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🎭 GSFCU Got Talent Backend Server running!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🌐 Health URL: http://0.0.0.0:${PORT}/health`);
  console.log(`📁 Database: ${DB_FILE}`);
  console.log(`===============================================`);
});
