import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env.local if present
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://mkdigitalnexus_db_user:8MKTzClBx7e2Z7cS@cluster0.xlegwoq.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB = process.env.MONGODB_DB || "g1_healthcare";

console.log("--------------------------------------------------");
console.log("🚀 Initializing G1 Healthcare MongoDB Data Upload");
console.log(`📡 Cluster URI: ${MONGODB_URI.replace(/:([^@]+)@/, ":****@")}`);
console.log(`🗄️ Database: ${MONGODB_DB}`);
console.log("--------------------------------------------------");

async function extractStoreData() {
  const storeFilePath = path.resolve(__dirname, "../src/utils/healthStore.js");
  const storeContent = fs.readFileSync(storeFilePath, "utf8");

  // Dynamically import data files
  const { providers, cities } = await import("../src/data/providers.js");
  const { faqs } = await import("../src/data/faqs.js");
  const { services: rawServices } = await import("../src/data/services.js");

  // Read healthStore via eval in an isolated context
  // Replace export default and exports with window/global assignments
  const sanitized = storeContent
    .replace(/^export default healthStore;/m, "")
    .replace(/^export const /gm, "const ");

  const evalContext = new Function(
    `${sanitized}; return { DEFAULT_PATIENT, DEFAULT_SERVICES, DEFAULT_LAB_TESTS, DEFAULT_STAFF, DEFAULT_DOCTORS, DEFAULT_BOOKINGS };`
  );

  const {
    DEFAULT_PATIENT,
    DEFAULT_SERVICES,
    DEFAULT_LAB_TESTS,
    DEFAULT_STAFF,
    DEFAULT_DOCTORS,
    DEFAULT_BOOKINGS,
  } = evalContext();

  return {
    patient: DEFAULT_PATIENT,
    services: DEFAULT_SERVICES || rawServices,
    labTests: DEFAULT_LAB_TESTS,
    staff: DEFAULT_STAFF,
    doctors: DEFAULT_DOCTORS,
    bookings: DEFAULT_BOOKINGS,
    providers,
    faqs,
  };
}

async function uploadAllData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("⏳ Connecting to MongoDB Atlas cluster...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const db = client.db(MONGODB_DB);

    console.log("\n📦 Extracting application data from healthStore and data layer...");
    const data = await extractStoreData();

    // 1. DOCTORS COLLECTION
    console.log(`\n👨‍⚕️ Uploading Doctors (${data.doctors.length} items)...`);
    const doctorsColl = db.collection("doctors");
    for (const doc of data.doctors) {
      await doctorsColl.updateOne(
        { $or: [{ id: doc.id }, { slug: doc.slug }] },
        { 
          $set: { ...doc, updatedAt: new Date() },
          $unset: { videoConsultFee: "", videoAvailable: "", videoConsult: "" }
        },
        { upsert: true }
      );
    }
    // Also clean up any lingering video fields across all doctors in collection
    await doctorsColl.updateMany(
      {},
      { $unset: { videoConsultFee: "", videoAvailable: "", videoConsult: "" } }
    );
    const docCount = await doctorsColl.countDocuments();
    console.log(`✅ Doctors collection synced: ${docCount} total documents`);

    // 2. SERVICES & DIAGNOSTICS COLLECTION
    console.log(`\n🏥 Uploading Healthcare Services (${data.services.length} items)...`);
    const servicesColl = db.collection("services");
    for (const s of data.services) {
      await servicesColl.updateOne(
        { $or: [{ id: s.id }, { slug: s.slug }] },
        { $set: { ...s, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const srvCount = await servicesColl.countDocuments();
    console.log(`✅ Services collection synced: ${srvCount} total documents`);

    // 3. LAB TESTS COLLECTION
    console.log(`\n🧪 Uploading Lab Tests & Health Packages (${data.labTests.length} items)...`);
    const labColl = db.collection("lab_tests");
    for (const t of data.labTests) {
      await labColl.updateOne(
        { id: t.id },
        { $set: { ...t, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const labCount = await labColl.countDocuments();
    console.log(`✅ Lab Tests collection synced: ${labCount} total documents`);

    // 4. PATIENT & HEALTH CARDS COLLECTION
    console.log(`\n🪪 Uploading Patient Profile & Health Card records...`);
    const patientColl = db.collection("patients");
    await patientColl.updateOne(
      { healthId: data.patient.healthId },
      { $set: { ...data.patient, updatedAt: new Date() } },
      { upsert: true }
    );
    const patCount = await patientColl.countDocuments();
    console.log(`✅ Patients collection synced: ${patCount} total documents`);

    // 5. STAFF & CARE TEAM COLLECTION
    console.log(`\n👥 Uploading Medical Staff & Duty Roster (${data.staff.length} items)...`);
    const staffColl = db.collection("staff");
    for (const st of data.staff) {
      await staffColl.updateOne(
        { id: st.id },
        { $set: { ...st, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const staffCount = await staffColl.countDocuments();
    console.log(`✅ Staff collection synced: ${staffCount} total documents`);

    // 6. BOOKINGS & CRM LEADS COLLECTION
    console.log(`\n📅 Uploading Consultation & Service Bookings (${data.bookings.length} items)...`);
    const bookingsColl = db.collection("bookings");
    for (const b of data.bookings) {
      await bookingsColl.updateOne(
        { id: b.id },
        { $set: { ...b, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const bookingCount = await bookingsColl.countDocuments();
    console.log(`✅ Bookings collection synced: ${bookingCount} total documents`);

    // 7. PROVIDERS & HOSPITALS COLLECTION
    console.log(`\n🏢 Uploading Healthcare Providers & Hospitals (${data.providers.length} items)...`);
    const providersColl = db.collection("providers");
    for (const p of data.providers) {
      await providersColl.updateOne(
        { id: p.id },
        { $set: { ...p, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const provCount = await providersColl.countDocuments();
    console.log(`✅ Providers collection synced: ${provCount} total documents`);

    // 8. FAQS COLLECTION
    console.log(`\n❓ Uploading Frequently Asked Questions (${data.faqs.length} items)...`);
    const faqsColl = db.collection("faqs");
    for (const f of data.faqs) {
      await faqsColl.updateOne(
        { id: f.id },
        { $set: { ...f, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const faqCount = await faqsColl.countDocuments();
    console.log(`✅ FAQs collection synced: ${faqCount} total documents`);

    // 9. Create indexes for high performance
    console.log("\n⚡ Creating database indexes for high performance search...");
    await doctorsColl.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await doctorsColl.createIndex({ department: 1 });
    await doctorsColl.createIndex({ city: 1 });
    await servicesColl.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await patientColl.createIndex({ healthId: 1 }, { unique: true, sparse: true });
    await bookingsColl.createIndex({ id: 1 }, { unique: true, sparse: true });

    console.log("\n==================================================");
    console.log("🎉 ALL DATA SUCCESSFULLY UPLOADED TO MONGODB ATLAS!");
    console.log("==================================================");
    console.log(`📊 Summary of Collections in "${MONGODB_DB}":`);
    console.log(` - doctors:    ${docCount} records`);
    console.log(` - services:   ${srvCount} records`);
    console.log(` - lab_tests:  ${labCount} records`);
    console.log(` - patients:   ${patCount} records`);
    console.log(` - staff:      ${staffCount} records`);
    console.log(` - bookings:   ${bookingCount} records`);
    console.log(` - providers:  ${provCount} records`);
    console.log(` - faqs:       ${faqCount} records`);
    console.log("==================================================\n");
  } catch (err) {
    console.error("❌ Error uploading data to MongoDB:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

uploadAllData();
