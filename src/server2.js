const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");
const DeliveryPartner = require("./models/DeliveryPartner");
const LiveOrder = require("./models/LiveOrder");
const FoodShelter = require("./models/FoodShelter");
const Donation = require("./models/Donation");

const app = express();

// ============================================================================
// CRITICAL: Enable JSON parsing BEFORE urlencoded
// This is necessary for NoSQL injection to work
// ============================================================================
app.use(express.json()); // Parse JSON payloads FIRST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "snackr-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false, // VULNERABLE: Allows XSS to steal cookies
      secure: false,   // VULNERABLE: No HTTPS requirement
    }
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/snackr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ============================================================================
// VULNERABILITY #1: XSS (Cross-Site Scripting)
// REMOVED THE esc() FUNCTION - All user input is now rendered directly
// ============================================================================

// ============================================================================
// VULNERABILITY #2: NoSQL Injection (MongoDB) - FIXED VERSION
// Direct query construction without sanitization
// ============================================================================

app.post("/login/user/vulnerable", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📥 Login attempt with:", { email, password });

    // VULNERABLE: Direct use of user input in MongoDB query
    // This allows NoSQL injection attacks
    // Attack payload: {"email": {"$ne": null}, "password": {"$ne": null}}
    const user = await User.findOne({ 
      email: email,      // No type checking - can be object
      password: password // VULNERABLE: Comparing directly with password field
    });
    
    if (user) {
      console.log("✅ User found via NoSQL injection:", user.email);
      req.session.userId = user._id;
      
      // Return success response
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Login Successful</title>
          <style>
            body { font-family: sans-serif; padding: 40px; background: #d4edda; text-align: center; }
            .success { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; border: 3px solid #28a745; }
            h1 { color: #28a745; }
            code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>🎉 NoSQL Injection Successful!</h1>
            <p>You bypassed authentication and logged in as:</p>
            <h2>${user.email}</h2>
            <p><strong>Attack Vector:</strong> NoSQL Injection</p>
            <p><strong>Payload Used:</strong></p>
            <code>{"email": {"$ne": null}, "password": {"$ne": null}}</code>
            <p style="margin-top: 20px;">
              <a href="/restaurants/vulnerable" style="color: #007bff;">Continue to Dashboard</a> | 
              <a href="/restaurants/vulnerable" style="color: #007bff;">Back</a>
            </p>
          </div>
        </body>
        </html>
      `);
    }

    // If no user found, return error
    return res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Login Failed</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #f8d7da; text-align: center; }
          .error { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; border: 3px solid #dc3545; }
          h1 { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Login Failed</h1>
          <p>Invalid credentials or no users in database</p>
          <p>Visit <a href="/setup/test-data">/setup/test-data</a> to create test users first!</p>
          <p><a href="/restaurants/vulnerable">Back</a></p>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #f8d7da;">
        <h1>Error: ${error.message}</h1>
        <pre>${error.stack}</pre>
        <p><a href="/restaurants/vulnerable">Back</a></p>
      </body>
      </html>
    `);
  }
});

// ============================================================================
// VULNERABILITY #3: SQL Injection Simulation (eval vulnerability)
// ============================================================================

app.post("/search/vulnerable", async (req, res) => {
  try {
    const { searchTerm } = req.body;
    
    console.log("🔍 Search with term:", searchTerm);
    
    // VULNERABLE: Using eval to construct query
    // Attack example: searchTerm = ".* }); return db.users.find({" 
    const query = eval(`({ name: /${searchTerm}/i })`);
    
    const results = await Restaurant.find(query).lean();
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Search Results</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f8f9fa; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .result { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="warning">⚠️ This search used eval() - EXTREMELY DANGEROUS!</div>
          <h2>Search Results for: "${searchTerm}"</h2>
          <p>Found ${results.length} result(s)</p>
          ${results.map(r => `
            <div class="result">
              <h3>${r.name}</h3>
              <p>${r.cuisine || 'N/A'} - ${r.address || 'N/A'}</p>
            </div>
          `).join('')}
          <p><a href="/restaurants/vulnerable">Back</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).send(`
      <h1>Error in eval():</h1>
      <pre>${error.message}</pre>
      <p><a href="/restaurants/vulnerable">Back</a></p>
    `);
  }
});

// ============================================================================
// VULNERABILITY #4: Command Injection - FIXED VERSION
// Executing system commands with user input
// ============================================================================

const { exec } = require('child_process');

app.post("/ping/vulnerable", (req, res) => {
  const { host } = req.body;
  
  console.log("🏓 Ping request for host:", host);
  
  // VULNERABLE: Direct command execution with user input
  // Detect OS for proper ping syntax
  const isWindows = process.platform === 'win32';
  const command = isWindows ? `ping -n 4 ${host}` : `ping -c 4 ${host}`;
  
  console.log("💀 Executing command:", command);
  console.log("🖥️  OS Platform:", isWindows ? 'Windows' : 'Linux/Mac');
  
  // CRITICAL FIX: shell:true allows command chaining with ; && | operators
  exec(command, { timeout: 10000, shell: true }, (error, stdout, stderr) => {
    if (error) {
      console.log("⚠️ Command error (injection may still work):", error.message);
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Command Execution Error</title>
          <style>
            body { font-family: monospace; padding: 20px; background: #fff3cd; }
            .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; border: 3px solid #ffc107; }
            pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
            code { background: #ffe5e5; padding: 2px 6px; border-radius: 4px; color: #d32f2f; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="warning">⚠️ Command Injection Attempted!</div>
            <h2>Command Executed:</h2>
            <pre>${command}</pre>
            <h2>Error Output:</h2>
            <pre>${error.message}</pre>
            ${stderr ? `<h2>STDERR:</h2><pre>${stderr}</pre>` : ''}
            ${stdout ? `<h2>STDOUT (Partial):</h2><pre>${stdout}</pre>` : ''}
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #28a745;">
              <strong>💡 Try these payloads:</strong><br>
              ${isWindows 
                ? '• <code>127.0.0.1 & whoami</code><br>• <code>127.0.0.1 & dir</code><br>• <code>127.0.0.1 & type package.json</code>' 
                : '• <code>127.0.0.1; whoami</code><br>• <code>127.0.0.1; ls -la</code><br>• <code>127.0.0.1 && cat /etc/passwd</code>'
              }
            </div>
            <p style="margin-top: 20px;"><a href="/restaurants/vulnerable">← Back</a></p>
          </div>
        </body>
        </html>
      `);
    }
    
    console.log("✅ Command executed successfully!");
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Command Execution Result</title>
        <style>
          body { font-family: monospace; padding: 20px; background: #d4edda; }
          .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; border: 3px solid #28a745; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; line-height: 1.5; }
          .success { background: #d4edda; border: 1px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px; color: #155724; font-weight: bold; }
          code { background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #155724; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✅ Command Injection Successful!</div>
          <h2>Command Executed:</h2>
          <pre>${command}</pre>
          <h2>Output:</h2>
          <pre>${stdout}</pre>
          ${stderr ? `<h2>STDERR:</h2><pre>${stderr}</pre>` : ''}
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #28a745;">
            <strong>🎯 Attack Success!</strong> The server executed your injected command.<br><br>
            <strong>More payloads to try:</strong><br>
            ${isWindows 
              ? '• <code>127.0.0.1 & dir</code><br>• <code>127.0.0.1 & type package.json</code><br>• <code>127.0.0.1 & echo %USERNAME%</code>' 
              : '• <code>127.0.0.1; ls -la</code><br>• <code>127.0.0.1 && cat package.json</code><br>• <code>127.0.0.1 | echo $USER</code>'
            }
          </div>
          <p style="margin-top: 20px;"><a href="/restaurants/vulnerable">← Back</a></p>
        </div>
      </body>
      </html>
    `);
  });
});

// ============================================================================
// VULNERABILITY #5: Path Traversal
// Unrestricted file access
// ============================================================================

const fs = require('fs');

app.get("/download/vulnerable", (req, res) => {
  const { filename } = req.query;
  
  console.log("📁 File download request:", filename);
  
  // VULNERABLE: No path validation
  // Attack example: filename = "../../package.json" or "../../../etc/passwd"
  const filePath = path.join(__dirname, 'uploads', filename);
  
  console.log("📂 Resolved path:", filePath);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>File Not Found</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #f8d7da;">
          <h1>❌ File Not Found</h1>
          <p>Attempted path: <code>${filePath}</code></p>
          <p>Error: ${err.message}</p>
          <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <strong>💡 Try these payloads:</strong><br>
            • <code>../package.json</code><br>
            • <code>../../package.json</code><br>
            • <code>../server.js</code> (or your main file name)
          </div>
          <p><a href="/restaurants/vulnerable">Back</a></p>
        </body>
        </html>
      `);
    }
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>File Contents</title>
        <style>
          body { font-family: monospace; padding: 20px; background: #d4edda; }
          .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
          .success { background: #d4edda; border: 1px solid #28a745; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✅ Path Traversal Successful!</div>
          <h2>File Path:</h2>
          <pre>${filePath}</pre>
          <h2>File Contents:</h2>
          <pre>${data}</pre>
          <p><a href="/restaurants/vulnerable">Back</a></p>
        </div>
      </body>
      </html>
    `);
  });
});

// ============================================================================
// VULNERABLE USER REGISTRATION - FIXED VALIDATION ERROR
// ============================================================================

app.post("/register/user/vulnerable", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("📝 Registration attempt:", { name, email });

  try {
    // NO INPUT SANITIZATION - Allows XSS
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(`⚠️ Email already registered. <a href='/user'>Login instead</a>`);
    }

    const hashed = await bcrypt.hash(password, 10);

    // FIXED: Provide required address fields with dummy data
    const newUser = new User({
      name, // STILL VULNERABLE: Can contain <script> tags
      email,
      password: hashed,
      address: {
        flat: "N/A",
        building: "N/A",
        region: "N/A",
        landmark: "N/A",
        city: "N/A",
        pin: 0
      }
    });

    await newUser.save();
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Registration Successful</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #d4edda; text-align: center;">
        <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
          <h1>✅ Registration Successful!</h1>
          <p>User created: <strong>${name}</strong></p>
          <p>Email: ${email}</p>
          <p>If name contains XSS, it will execute when displayed!</p>
          <p><a href="/restaurants/vulnerable">Continue</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).send(`<h1>Error: ${error.message}</h1><pre>${error.stack}</pre>`);
  }
});

// ============================================================================
// VULNERABLE RESTAURANT PAGE - Displays unsanitized data
// ============================================================================

app.get("/restaurants/vulnerable", async (req, res) => {
  const rests = await Restaurant.find().lean();
  
  // Detect OS for command injection examples
  const isWindows = process.platform === 'win32';
  
  // XSS VULNERABILITY: Direct rendering without escaping
  const restaurantsJson = JSON.stringify(rests.map(r => ({
    _id: r._id.toString(), 
    name: r.name, // NO ESCAPING
    type: r.type || "Normal", 
    cuisine: r.cuisine || "Mixed", 
    address: r.address || "N/A"
  })));

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vulnerable Demo - Security Testing</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { font-family: 'Inter', sans-serif; }
            .vuln-box { background: #fff3cd; border: 2px solid #ffc107; transition: all 0.3s; }
            .vuln-box:hover { box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3); transform: translateY(-2px); }
            .vuln-box h3 { color: #856404; font-weight: bold; margin-bottom: 10px; }
            .test-btn { background: #007bff; color: white; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; transition: all 0.3s; }
            .test-btn:hover { background: #0056b3; transform: scale(1.02); }
            code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em; color: #d32f2f; font-weight: bold; }
            .os-badge { background: #e3f2fd; padding: 8px 15px; border-radius: 8px; border-left: 4px solid #2196f3; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <!-- Warning Banner -->
            <div class="bg-red-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-lg mb-6 text-center">
                <h1 class="text-2xl font-bold mb-2">⚠️ INTENTIONALLY VULNERABLE APPLICATION ⚠️</h1>
                <p class="text-lg">FOR EDUCATIONAL PURPOSES ONLY - DO NOT USE IN PRODUCTION</p>
            </div>

            <!-- OS Detection Badge -->
            <div class="os-badge mb-6">
                <strong>🖥️ Detected OS:</strong> ${isWindows ? 'Windows' : 'Linux/Mac'}<br>
                <strong>📋 Command syntax:</strong> Use <code>${isWindows ? '&' : ';'}</code> or <code>&&</code> for command chaining
            </div>

            <h2 class="text-3xl font-bold mb-6 text-gray-800">🔓 Vulnerability Testing Suite</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <!-- VULNERABILITY TEST #1: XSS -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>1️⃣ Cross-Site Scripting (XSS)</h3>
                    <p class="text-sm mb-3 text-gray-700">Test payload execution in user input</p>
                    <form method="POST" action="/test/xss">
                        <input type="text" name="userInput" 
                               placeholder='Try: <img src=x onerror="alert(\\'XSS\\')">' 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="submit" class="test-btn w-full">Test XSS</button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 Payload: <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
                </div>

                <!-- VULNERABILITY TEST #2: NoSQL Injection -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>2️⃣ NoSQL Injection</h3>
                    <p class="text-sm mb-3 text-gray-700">Bypass authentication with object injection</p>
                    <form method="POST" action="/login/user/vulnerable" id="nosql-form">
                        <input type="text" name="email" 
                               placeholder='Email or {"$ne": null}' 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <input type="text" name="password" 
                               placeholder='Password or {"$ne": null}' 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="button" onclick="submitNoSQLInjection()" class="test-btn w-full">
                            Test NoSQL Injection
                        </button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 Bypasses authentication if users exist</p>
                    <p class="text-xs mt-1 text-red-600"><strong>⚠️ Run /setup/test-data first!</strong></p>
                </div>

                <!-- VULNERABILITY TEST #3: Command Injection -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>3️⃣ Command Injection</h3>
                    <p class="text-sm mb-3 text-gray-700">Execute system commands via ping</p>
                    <form method="POST" action="/ping/vulnerable">
                        <input type="text" name="host" 
                               placeholder="Try: 127.0.0.1${isWindows ? ' & whoami' : '; whoami'}" 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="submit" class="test-btn w-full">Test Command Injection</button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 ${isWindows ? '<code>127.0.0.1 & dir</code>' : '<code>127.0.0.1; ls -la</code>'}</p>
                </div>

                <!-- VULNERABILITY TEST #4: Path Traversal -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>4️⃣ Path Traversal</h3>
                    <p class="text-sm mb-3 text-gray-700">Access files outside intended directory</p>
                    <form method="GET" action="/download/vulnerable">
                        <input type="text" name="filename" 
                               placeholder="Try: ../../package.json" 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="submit" class="test-btn w-full">Test Path Traversal</button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 Payload: <code>../../../etc/passwd</code></p>
                </div>

                <!-- VULNERABILITY TEST #5: Eval Injection -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>5️⃣ Eval Injection</h3>
                    <p class="text-sm mb-3 text-gray-700">Execute arbitrary JavaScript via eval()</p>
                    <form method="POST" action="/search/vulnerable">
                        <input type="text" name="searchTerm" 
                               placeholder="Try: .*" 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="submit" class="test-btn w-full">Test Eval Injection</button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 Searches use dangerous eval()</p>
                </div>

                <!-- VULNERABILITY TEST #6: Stored XSS -->
                <div class="vuln-box p-5 rounded-lg">
                    <h3>6️⃣ Stored XSS (Registration)</h3>
                    <p class="text-sm mb-3 text-gray-700">Store malicious scripts in database</p>
                    <form method="POST" action="/register/user/vulnerable">
                        <input type="text" name="name" 
                               placeholder='Name: <script>alert("Stored XSS")</script>' 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <input type="email" name="email" 
                               placeholder="email@test.com" 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <input type="password" name="password" 
                               placeholder="password" 
                               class="border p-2 w-full mb-2 rounded text-sm">
                        <button type="submit" class="test-btn w-full">Register with XSS</button>
                    </form>
                    <p class="text-xs mt-2 text-gray-600">💡 XSS stored in name field</p>
                </div>
            </div>

            <!-- Restaurant List (if any) -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-bold mb-4 text-gray-800">Restaurant List (May contain XSS)</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="restaurant-list">
                    <p class="text-gray-500 col-span-full">No restaurants loaded or list rendering...</p>
                </div>
            </div>

            <!-- Help Section -->
            <div class="mt-8 bg-blue-50 border-2 border-blue-300 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-3 text-blue-800">📚 Quick Start Guide</h3>
                <ol class="list-decimal list-inside space-y-2 text-gray-700">
                    <li><strong>Setup:</strong> Visit <a href="/setup/test-data" class="text-blue-600 underline font-semibold">/setup/test-data</a> to create test users first!</li>
                    <li><strong>XSS:</strong> Enter <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> or <code>&lt;img src=x onerror=alert('XSS')&gt;</code></li>
                    <li><strong>NoSQL:</strong> Click "Test NoSQL Injection" button (auto-fills payload)</li>
                    <li><strong>Command:</strong> Enter <code>127.0.0.1${isWindows ? ' & whoami' : '; whoami'}</code> or <code>127.0.0.1${isWindows ? ' & dir' : ' && ls -la'}</code></li>
                    <li><strong>Path Traversal:</strong> Enter <code>../../package.json</code> or <code>../../../etc/passwd</code></li>
                    <li><strong>Eval:</strong> Enter <code>.*</code> or any regex pattern</li>
                </ol>
            </div>
        </div>

        <script>
            // NoSQL Injection auto-submission
            function submitNoSQLInjection() {
                const form = document.getElementById('nosql-form');
                const formData = new FormData(form);
                
                // Create JSON payload
                const payload = {
                    email: {"$ne": null},
                    password: {"$ne": null}
                };
                
                // Submit as JSON
                fetch('/login/user/vulnerable', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.text())
                .then(html => {
                    // Display response in new window or current page
                    document.write(html);
                    document.close();
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
            }

            // Render restaurants (with XSS vulnerability)
            const allRestaurants = ${restaurantsJson};
            const restaurantList = document.getElementById('restaurant-list');

            if (allRestaurants.length > 0) {
                restaurantList.innerHTML = '';
                // VULNERABLE: Direct innerHTML injection
                allRestaurants.forEach(r => {
                    const card = document.createElement('div');
                    card.className = 'bg-white p-4 rounded-lg shadow border';
                    // XSS VULNERABILITY: No sanitization
                    card.innerHTML = \`
                        <h3 class="font-bold text-lg mb-2">\${r.name}</h3>
                        <p class="text-sm text-gray-600">\${r.cuisine}</p>
                        <p class="text-xs text-gray-500 mt-1">\${r.address}</p>
                    \`;
                    restaurantList.appendChild(card);
                });
            }
        </script>
    </body>
    </html>
  `);
});

// ============================================================================
// XSS TEST ENDPOINT
// ============================================================================

app.post("/test/xss", (req, res) => {
  const { userInput } = req.body;
  
  console.log("🔥 XSS test with input:", userInput);
  
  // VULNERABLE: Direct rendering of user input
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>XSS Test Result</title>
      <style>
        body { font-family: sans-serif; padding: 40px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .output { border: 3px solid #dc3545; padding: 20px; background: #ffe0e0; border-radius: 4px; margin: 20px 0; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
      </style>
    </head>
    <body>
        <div class="container">
            <div class="warning">
                <strong>⚠️ XSS Vulnerability Demonstration</strong><br>
                The content below is rendered WITHOUT sanitization!
            </div>
            
            <h1>You entered:</h1>
            <pre>${userInput}</pre>
            
            <h2>Rendered Output (VULNERABLE):</h2>
            <div class="output">
                ${userInput}
            </div>
            
            <p style="margin-top: 30px;">
                <a href="/restaurants/vulnerable" style="color: #007bff; text-decoration: none; font-weight: bold;">← Back to Vulnerability Tests</a>
            </p>
        </div>
    </body>
    </html>
  `);
});

// ============================================================================
// ORIGINAL SECURE ROUTES (for comparison)
// ============================================================================

// Safe escaping function (for comparison)
function esc(s) {
  return s ? String(s).replace(/[&<>"']/g, (c) => ({ 
    "&": "&amp;", 
    "<": "&lt;", 
    ">": "&gt;", 
    '"': "&quot;",
    "'": "&#39;"
  }[c])) : "";
}

// Original secure user route
app.get("/user", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>User Access (Reference - Secure Version)</title>
      <style>
        body { font-family: sans-serif; padding: 20px; background: #e8f5e9; }
        .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #218838; }
        .info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; margin-bottom: 20px; border-radius: 4px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="info">
          ✅ This is a SECURE reference implementation<br>
          (Not part of vulnerability demonstration)
        </div>
        <h2>Secure Login</h2>
        <form method="POST" action="/login/user">
          <input name="email" type="email" placeholder="Email" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Login Securely</button>
        </form>
        <p style="text-align: center; margin-top: 20px;">
          <a href="/restaurants/vulnerable">Go to Vulnerable Demo →</a>
        </p>
      </div>
    </body>
    </html>
  `);
});

// Test endpoint to create sample data
app.get("/setup/test-data", async (req, res) => {
  try {
    // Create test user with required address fields
    const testUser = await User.findOne({ email: "test@example.com" });
    if (!testUser) {
      const hashedPass = await bcrypt.hash("password123", 10);
      await new User({
        name: "Test User",
        email: "test@example.com",
        password: hashedPass,
        address: {
          flat: "123",
          building: "Test Building",
          region: "Test Region",
          landmark: "Test Landmark",
          city: "Test City",
          pin: 12345
        }
      }).save();
    }
    
    // Create test restaurant
    const testRest = await Restaurant.findOne({ name: "Test Restaurant" });
    if (!testRest) {
      await new Restaurant({
        name: "Test Restaurant",
        email: "restaurant@test.com",
        password: "password123",
        cuisine: "Italian",
        address: "123 Test St"
      }).save();
    }
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Setup Complete</title>
        <style>
          body { font-family: sans-serif; background: #d4edda; padding: 40px; text-align: center; }
          .box { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
          h1 { color: #28a745; }
          ul { text-align: left; display: inline-block; margin: 20px 0; }
          .btn { display: inline-block; margin-top: 20px; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .btn:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>✅ Test Data Created!</h1>
          <ul>
            <li><strong>Test User:</strong> test@example.com / password123</li>
            <li><strong>Test Restaurant:</strong> Test Restaurant</li>
          </ul>
          <p style="color: #666; margin-top: 20px;">Now you can test NoSQL injection and other vulnerabilities!</p>
          <a href="/restaurants/vulnerable" class="btn">Go to Vulnerability Tests →</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error creating test data: " + error.message);
  }
});

// Root route
app.get("/", (req, res) => {
  res.redirect("/restaurants/vulnerable");
});

app.listen(3001, () => {
  console.log("\n" + "=".repeat(70));
  console.log("🚀 VULNERABLE APPLICATION RUNNING");
  console.log("=".repeat(70));
  console.log("📍 URL: http://localhost:3001");
  console.log("🖥️  OS Platform: " + (process.platform === 'win32' ? 'Windows' : 'Linux/Mac'));
  console.log("⚠️  WARNING: Contains INTENTIONAL security vulnerabilities!");
  console.log("🎓 FOR EDUCATIONAL PURPOSES ONLY");
  console.log("=".repeat(70));
  console.log("\n📚 Available Endpoints:");
  console.log("   🏠 Main Demo:           /restaurants/vulnerable");
  console.log("   🔓 NoSQL Injection:     /login/user/vulnerable");
  console.log("   💉 XSS Test:            /test/xss");
  console.log("   🔍 Eval Injection:      /search/vulnerable");
  console.log("   💻 Command Injection:   /ping/vulnerable");
  console.log("   📁 Path Traversal:      /download/vulnerable");
  console.log("   🗃️  Setup Test Data:    /setup/test-data (RUN THIS FIRST!)");
  console.log("=".repeat(70) + "\n");
});
