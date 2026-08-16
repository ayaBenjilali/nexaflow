import bcrypt from "bcryptjs";
import { ApiError } from "../utils/http.js";
import { activities, customers, deals, initializePasswords, leads, notifications, projects, tasks, users, type Customer, type Deal, type Lead, type Task } from "../data/demo.js";

await initializePasswords();
const paginate = <T>(items: T[], page = 1, limit = 10) => ({ items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit });
const filterSearch = <T extends Record<string, unknown>>(items: T[], search = "") => !search ? items : items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
export const authRepo = {
  async login(email: string, password: string) { const user = users.find((u) => u.email === email); if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS"); return user; },
  async register(input: { name: string; email: string; password: string }) { if (users.some((u) => u.email === input.email)) throw new ApiError(409, "Email is already registered", "EMAIL_EXISTS"); const user = { id: `user_${Date.now()}`, name: input.name, email: input.email, role: "TEAM_MEMBER" as const, title: "New team member", avatar: input.name.split(" ").map((p) => p[0]).join("").slice(0,2).toUpperCase(), passwordHash: await bcrypt.hash(input.password, 10) }; users.push(user); return user; },
  findUser(id: string) { return users.find((u) => u.id === id); }
};
export const repo = {
  users: () => users.map(({ passwordHash: _passwordHash, ...u }) => u),
  list: (name: "customers" | "leads" | "deals" | "projects" | "tasks", query: any) => {
    const source = { customers, leads, deals, projects, tasks }[name] as any[];
    let result = filterSearch(source, query.search);
    for (const key of ["status","stage","priority","assigneeId"]) if (query[key]) result = result.filter((item) => item[key] === query[key]);
    return paginate(result, Number(query.page ?? 1), Number(query.limit ?? 12));
  },
  get: (name: "customers" | "leads" | "deals" | "projects" | "tasks", id: string) => ({ customers, leads, deals, projects, tasks }[name] as any[]).find((i) => i.id === id),
  createCustomer: (input: Partial<Customer>) => { const item = { id: `cust_${Date.now()}`, status: "ACTIVE", createdAt: new Date().toISOString(), ownerId: "user_manager", value: 0, segment: "Professional Services", ...input } as Customer; customers.unshift(item); return item; },
  createLead: (input: Partial<Lead>) => { const item = { id: `lead_${Date.now()}`, status: "NEW", createdAt: new Date().toISOString(), assignedUserId: "user_manager", estimatedValue: 0, source: "Website", notes: "", ...input } as Lead; leads.unshift(item); return item; },
  updateDeal: (id: string, input: Partial<Deal>) => { const item = deals.find((d) => d.id === id); if (!item) throw new ApiError(404, "Deal not found", "NOT_FOUND"); Object.assign(item, input); return item; },
  updateTask: (id: string, input: Partial<Task>) => { const item = tasks.find((t) => t.id === id); if (!item) throw new ApiError(404, "Task not found", "NOT_FOUND"); Object.assign(item, input); return item; },
  remove: (name: "customers" | "leads" | "tasks", id: string) => { const source = { customers, leads, tasks }[name] as any[]; const index = source.findIndex((i) => i.id === id); if (index >= 0) source.splice(index, 1); },
  notifications: (userId: string) => notifications.filter((n) => n.userId === userId || userId === "user_admin"),
  readNotification: (id: string) => { const note = notifications.find((n) => n.id === id); if (note) note.read = true; return note; },
  activities: () => activities.slice(0, 12),
  analytics: () => {
    const wonRevenue = deals.filter((d) => d.stage === "WON").reduce((s, d) => s + d.value, 0);
    return {
      totalCustomers: customers.filter((c) => c.status === "ACTIVE").length,
      newCustomers: customers.filter((c) => Date.now() - Date.parse(c.createdAt) < 30 * 86400000).length,
      leadConversionRate: Math.round((leads.filter((l) => l.status === "CONVERTED").length / leads.length) * 100),
      totalPipelineValue: deals.filter((d) => !["WON","LOST"].includes(d.stage)).reduce((s, d) => s + d.value, 0),
      wonRevenue,
      activeProjects: projects.filter((p) => p.status === "ACTIVE").length,
      projectCompletionRate: Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length),
      taskCompletionRate: Math.round((tasks.filter((t) => t.status === "COMPLETED").length / tasks.length) * 100),
      leadsByStatus: ["NEW","CONTACTED","QUALIFIED","UNQUALIFIED","CONVERTED"].map((status) => ({ name: status, value: leads.filter((l) => l.status === status).length })),
      dealsByStage: ["NEW","QUALIFIED","PROPOSAL","NEGOTIATION","WON","LOST"].map((stage) => ({ name: stage, value: deals.filter((d) => d.stage === stage).length })),
      revenueByMonth: ["Mar","Apr","May","Jun","Jul","Aug"].map((month, i) => ({ month, revenue: wonRevenue / 6 + i * 4200 })),
      teamProductivity: users.slice(1).map((u) => ({ name: u.name.split(" ")[0], completed: tasks.filter((t) => t.assigneeId === u.id && t.status === "COMPLETED").length, active: tasks.filter((t) => t.assigneeId === u.id && t.status !== "COMPLETED").length }))
    };
  }
};
