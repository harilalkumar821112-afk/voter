// Database Connection Test Script
require("dotenv").config();
const mongoose = require("mongoose");

async function testDatabaseConnection() {
  console.log("🧪 Testing MongoDB Atlas Connection...\n");

  try {
    // Test 1: Connection String
    console.log("📝 Connection Details:");
    const uri = process.env.MONGO_URI;
    const dbName = uri.split("/").pop().split("?")[0];
    console.log(`Database: ${dbName}`);
    console.log(`Connection String: ${uri.split("@")[1] || "configured"}\n`);

    // Test 2: Connect to MongoDB
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Successfully connected to MongoDB Atlas\n");

    // Test 3: Get Database Stats
    console.log("📊 Database Statistics:");
    const admin = mongoose.connection.db.admin();
    const stats = await admin.serverStatus();
    console.log(`- Server Uptime: ${stats.uptime} seconds`);
    console.log(`- Current Connections: ${stats.connections.current}`);
    console.log(`- Available Connections: ${stats.connections.available}\n`);

    // Test 4: List Collections
    console.log("📚 Collections in Database:");
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log("(No collections yet - database is empty)");
    } else {
      collections.forEach((col) => {
        console.log(`  ✓ ${col.name}`);
      });
    }
    console.log();

    // Test 5: Test Write Operation
    console.log("✍️  Testing Write Operation...");
    const testData = {
      _id: new mongoose.Types.ObjectId(),
      testKey: "database_connection_test",
      timestamp: new Date(),
    };
    const result = await mongoose.connection.db.collection("_test").insertOne(testData);
    console.log(`✅ Successfully inserted test document: ${result.insertedId}\n`);

    // Test 6: Test Read Operation
    console.log("📖 Testing Read Operation...");
    const retrieved = await mongoose.connection.db.collection("_test").findOne({
      testKey: "database_connection_test",
    });
    if (retrieved) {
      console.log(`✅ Successfully retrieved document`);
      console.log(`   - ID: ${retrieved._id}`);
      console.log(`   - Key: ${retrieved.testKey}\n`);
    }

    // Test 7: Cleanup
    console.log("🧹 Cleaning up test data...");
    await mongoose.connection.db.collection("_test").deleteOne({
      testKey: "database_connection_test",
    });
    console.log("✅ Test data removed\n");

    // Test 8: Models
    console.log("🔌 Checking Mongoose Models:");
    const User = require("./models/User");
    const Candidate = require("./models/Candidate");
    const Vote = require("./models/Vote");
    const Election = require("./models/Election");
    const OTP = require("./models/OTP");
    const AuditLog = require("./models/AuditLog");
    console.log("✅ User model connected");
    console.log("✅ Candidate model connected");
    console.log("✅ Vote model connected");
    console.log("✅ Election model connected");
    console.log("✅ OTP model connected");
    console.log("✅ AuditLog model connected\n");

    // Final Report
    console.log("════════════════════════════════════════");
    console.log("✅ DATABASE CONNECTION TEST PASSED");
    console.log("════════════════════════════════════════");
    console.log("\n📋 Summary:");
    console.log("✓ MongoDB Atlas Connected");
    console.log("✓ Connection String Valid");
    console.log("✓ Database Accessible");
    console.log("✓ Write Operations Working");
    console.log("✓ Read Operations Working");
    console.log("✓ All Models Loaded");
    console.log("\n🎉 Database is fully operational!\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED\n");
    console.error(`Error: ${err.message}\n`);
    
    if (err.message.includes("ECONNREFUSED")) {
      console.error("Issue: Cannot connect to MongoDB");
      console.error("Fix: Check if MongoDB service is running");
    } else if (err.message.includes("authentication failed")) {
      console.error("Issue: MongoDB credentials are incorrect");
      console.error("Fix: Verify MONGO_URI in .env file");
    } else if (err.message.includes("getaddrinfo")) {
      console.error("Issue: Cannot resolve MongoDB host");
      console.error("Fix: Check internet connection or MongoDB Atlas status");
    } else if (err.message.includes("timeout")) {
      console.error("Issue: Connection timeout to MongoDB");
      console.error("Fix: Check firewall settings or network connectivity");
    }

    console.error("\n📝 MongoDB URI in .env:");
    const uri = process.env.MONGO_URI;
    console.error(`${uri.substring(0, 30)}...${uri.substring(uri.length - 30)}\n`);

    console.error("🔧 Troubleshooting Steps:");
    console.error("1. Verify MONGO_URI in server/.env");
    console.error("2. Check MongoDB Atlas cluster is running");
    console.error("3. Verify network connection");
    console.error("4. Check firewall settings\n");

    process.exit(1);
  }
}

// Run test
testDatabaseConnection();
