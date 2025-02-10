import yup from "yup";

const userSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .required("Password is required"),
  permission: yup
    .string()
    .oneOf(
      ["read", "write", "admin"],
      'Permission must be "read", "write", or "admin"'
    )
    .required("Permission is required"),
});
