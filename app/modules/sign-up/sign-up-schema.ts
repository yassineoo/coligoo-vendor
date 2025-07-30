export type SignUpFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
  agreeToTerms: boolean;
};

export const signUpFormRules = {
  fullName: [
    { required: true, message: "Full name is required" },
    { min: 2, message: "Full name must be at least 2 characters long" },
  ],
  phoneNumber: [
    { required: true, message: "Phone number is required" },
    { pattern: /^[0-9]{10,11}$/, message: "Please enter a valid phone number" },
  ],
  email: [
    { required: true, message: "Email is required" },
    { type: "email" as const, message: "Please enter a valid email address" },
  ],
  password: [
    { required: true, message: "Password is required" },
    { min: 6, message: "Password must be at least 6 characters long" },
  ],
  confirmPassword: [
    { required: true, message: "Please confirm your password" },
  ],
  captcha: [{ required: true, message: "Please enter the CAPTCHA" }],
  agreeToTerms: [
    {
      required: true,
      message: "You must agree to the terms and privacy policy",
    },
  ],
};
