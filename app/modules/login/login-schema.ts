export type LoginFormData = {
  email: string;
  password: string;
};

export const loginFormRules = {
  email: [
    { required: true, message: "Email is required" },
    { type: "email" as const, message: "Please enter a valid email address" },
  ],
  password: [
    { required: true, message: "Password is required" },
    { min: 6, message: "Password must be at least 6 characters long" },
  ],
};
