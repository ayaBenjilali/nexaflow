import { Router } from "express";
import { repo } from "../repositories/demoRepository.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { created, ok } from "../utils/http.js";
import { ApiError } from "../utils/http.js";
import { customerSchema, dealUpdateSchema, leadSchema, taskUpdateSchema } from "../validators/common.js";
const router = Router();
router.use(requireAuth);
for (const name of ["customers","leads","deals","projects","tasks"] as const) {
  router.get(`/${name}`, (req, res) => { const page = repo.list(name, req.query); ok(res, page.items, { total: page.total, page: page.page, limit: page.limit }); });
  router.get(`/${name}/:id`, (req, res, next) => { const item = repo.get(name, String(req.params.id)); if (item) ok(res, item); else next(new ApiError(404, `${name} record not found`, "NOT_FOUND")); });
}
router.post("/customers", requireRole("ADMIN","MANAGER"), (req, res) => created(res, repo.createCustomer(customerSchema.parse(req.body))));
router.delete("/customers/:id", requireRole("ADMIN","MANAGER"), (req, res) => { repo.remove("customers", String(req.params.id)); ok(res, { deleted: true }); });
router.post("/leads", requireRole("ADMIN","MANAGER"), (req, res) => created(res, repo.createLead(leadSchema.parse(req.body))));
router.delete("/leads/:id", requireRole("ADMIN","MANAGER"), (req, res) => { repo.remove("leads", String(req.params.id)); ok(res, { deleted: true }); });
router.put("/deals/:id", requireRole("ADMIN","MANAGER"), (req, res) => ok(res, repo.updateDeal(String(req.params.id), dealUpdateSchema.parse(req.body))));
router.put("/tasks/:id", (req, res) => ok(res, repo.updateTask(String(req.params.id), taskUpdateSchema.parse(req.body))));
router.delete("/tasks/:id", requireRole("ADMIN","MANAGER"), (req, res) => { repo.remove("tasks", String(req.params.id)); ok(res, { deleted: true }); });
router.get("/team", requireRole("ADMIN","MANAGER"), (_req, res) => ok(res, repo.users()));
router.get("/activities", (_req, res) => ok(res, repo.activities()));
router.get("/notifications", (req, res) => ok(res, repo.notifications(req.user!.id)));
router.patch("/notifications/:id/read", (req, res) => ok(res, repo.readNotification(String(req.params.id))));
router.get("/analytics/overview", requireRole("ADMIN","MANAGER"), (_req, res) => ok(res, repo.analytics()));
export default router;
