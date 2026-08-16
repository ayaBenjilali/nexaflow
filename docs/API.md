# NexaFlow API

All endpoints return a consistent `{ success, data, meta? }` or `{ success:false, error }` envelope. Authenticated routes require `Authorization: Bearer <token>`.

Core routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/customers`, `/api/leads`, `/api/deals`, `/api/projects`, `/api/tasks`, `/api/notifications`, and `/api/analytics/overview`.
