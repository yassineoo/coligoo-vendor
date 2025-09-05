import type { User } from "~/types/global";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "~/redux/store";

const initialState: User = {
  id: 0,
  email: "",
  nom: "",
  prenom: "",
  fullName: "",
  role: "",
  permissions: "",
  hubId: "",
  hubAdmin: "",
  createdAt: "",
  dob: "",
  phoneNumber: "",
  sex: "",
  isEmailVerified: false,
  imgUrl: "",
  blocked: false,
  deviceToken: "",
  hubEmployeesCount: 0,
} satisfies User as User;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});
export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
