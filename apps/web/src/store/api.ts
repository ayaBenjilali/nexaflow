import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "/api";
const baseQuery = fetchBaseQuery({ baseUrl: apiBaseUrl, prepareHeaders: (headers, { getState }) => { const token = (getState() as RootState).auth.token; if (token) headers.set("authorization", `Bearer ${token}`); return headers; } });
export const api = createApi({ reducerPath: "api", baseQuery, tagTypes: ["Customer","Lead","Deal","Task","Notification"], endpoints: (builder) => ({
  login: builder.mutation<any, { email: string; password: string }>({ query: (body) => ({ url: "/auth/login", method: "POST", body }) }),
  register: builder.mutation<any, { name: string; email: string; password: string }>({ query: (body) => ({ url: "/auth/register", method: "POST", body }) }),
  analytics: builder.query<any, void>({ query: () => "/analytics/overview" }),
  list: builder.query<any, string>({ query: (resource) => `/${resource}?limit=100`, providesTags: (_r, _e, arg) => [arg as any] }),
  createCustomer: builder.mutation<any, any>({ query: (body) => ({ url: "/customers", method: "POST", body }), invalidatesTags: ["Customer"] }),
  createLead: builder.mutation<any, any>({ query: (body) => ({ url: "/leads", method: "POST", body }), invalidatesTags: ["Lead"] }),
  updateDeal: builder.mutation<any, { id: string; body: any }>({ query: ({ id, body }) => ({ url: `/deals/${id}`, method: "PUT", body }), invalidatesTags: ["Deal"] }),
  updateTask: builder.mutation<any, { id: string; body: any }>({ query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PUT", body }), invalidatesTags: ["Task"] }),
  notifications: builder.query<any, void>({ query: () => "/notifications", providesTags: ["Notification"] }),
  readNotification: builder.mutation<any, string>({ query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }), invalidatesTags: ["Notification"] })
})});
export const { useLoginMutation, useRegisterMutation, useAnalyticsQuery, useListQuery, useCreateCustomerMutation, useCreateLeadMutation, useUpdateDealMutation, useUpdateTaskMutation, useNotificationsQuery, useReadNotificationMutation } = api;
