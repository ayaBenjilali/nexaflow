import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type User = { id: string; name: string; email: string; role: string; title?: string };
const token = localStorage.getItem("nf_token");
const user = localStorage.getItem("nf_user");
const slice = createSlice({ name: "auth", initialState: { token, user: user ? JSON.parse(user) as User : null }, reducers: {
  setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => { state.token = action.payload.token; state.user = action.payload.user; localStorage.setItem("nf_token", action.payload.token); localStorage.setItem("nf_user", JSON.stringify(action.payload.user)); },
  logout: (state) => { state.token = null; state.user = null; localStorage.removeItem("nf_token"); localStorage.removeItem("nf_user"); }
}});
export const { setCredentials, logout } = slice.actions;
export default slice.reducer;