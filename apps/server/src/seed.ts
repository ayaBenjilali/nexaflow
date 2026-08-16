import { connectDb } from "./config/db.js";
import { company, customers, deals, leads, projects, tasks, users } from "./data/demo.js";
console.log("Seed preview ready:", { company: company.name, users: users.length, customers: customers.length, leads: leads.length, deals: deals.length, projects: projects.length, tasks: tasks.length });
await connectDb().catch(() => false);
console.log("Use MONGO_URI to persist these records into MongoDB; sample-data mode already includes the full dataset.");
