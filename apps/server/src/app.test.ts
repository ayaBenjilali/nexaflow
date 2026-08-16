import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
const app = createApp();
const login = async (email = "admin@nexaflow.demo") => (await request(app).post("/api/auth/login").send({ email, password: "NexaFlowDemo!2026" })).body.data.token;
describe("auth and core API", () => {
  it("registers, logs in, and reads current user", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Taylor Client", email: "taylor@nexaflow.demo", password: "NexaFlowDemo!2026" });
    expect(reg.status).toBe(201);
    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${reg.body.data.token}`);
    expect(me.body.data.user.email).toBe("taylor@nexaflow.demo");
  });
  it("protects routes and enforces roles", async () => {
    expect((await request(app).get("/api/customers")).status).toBe(401);
    const memberToken = await login("member@nexaflow.demo");
    expect((await request(app).post("/api/customers").set("Authorization", `Bearer ${memberToken}`).send({ name: "A", company: "B", email: "bad" })).status).toBe(403);
  });
  it("creates customers and leads and updates a deal", async () => {
    const token = await login();
    expect((await request(app).post("/api/customers").set("Authorization", `Bearer ${token}`).send({ name: "Riley Fox", company: "Fox Advisory", email: "riley@fox.test", value: 22000 })).status).toBe(201);
    expect((await request(app).post("/api/leads").set("Authorization", `Bearer ${token}`).send({ name: "Dana West", company: "West Ops", email: "dana@west.test", estimatedValue: 12000 })).status).toBe(201);
    const deals = await request(app).get("/api/deals").set("Authorization", `Bearer ${token}`);
    const moved = await request(app).put(`/api/deals/${deals.body.data[0].id}`).set("Authorization", `Bearer ${token}`).send({ stage: "NEGOTIATION", probability: 75 });
    expect(moved.body.data.stage).toBe("NEGOTIATION");
  });
});