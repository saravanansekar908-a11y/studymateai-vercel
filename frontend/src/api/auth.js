import apiClient from "./client";

// =======================
// Login
// =======================
export async function login({ email, password }) {
  const cleanEmail = email.trim();
  // Admin Login
  if (cleanEmail.toLowerCase() === "admin") {
    await apiClient.post("/api/admin/login", {
      username: cleanEmail,
      password: password,
    });

    return {
      access_token: "admin-token",
      token_type: "bearer",
      role: "admin",
      user: {
        full_name: "Administrator",
        email: "admin",
      },
    };
  }

  // Student Login (OAuth2 form-data compliant)
  const form = new URLSearchParams();
  form.append("username", cleanEmail.toLowerCase());
  form.append("password", password);

  const response = await apiClient.post("/api/auth/login", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return {
    ...response.data,
    role: "student",
  };
}

// =======================
// Signup
// =======================
export async function signup({ full_name, email, password }) {
  const response = await apiClient.post("/api/auth/signup", {
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data;
}

// =======================
// Reset Password
// =======================
export async function resetPassword({ email, new_password }) {
  const response = await apiClient.post("/api/auth/reset-password", {
    email: email.trim().toLowerCase(),
    new_password,
  });

  return response.data;
}

// =======================
// Save Session
// =======================
export function saveSession(data) {
  if (data.access_token) {
    localStorage.setItem("studymate_token", data.access_token);
  }
  if (data.role) {
    localStorage.setItem("studymate_role", data.role || "student");
  }
  if (data.user) {
    localStorage.setItem("studymate_user", JSON.stringify(data.user));
  }
}

// =======================
// Logout
// =======================
export function logout() {
  localStorage.removeItem("studymate_token");
  localStorage.removeItem("studymate_role");
  localStorage.removeItem("studymate_user");
}

// =======================
// Get Token
// =======================
export function getToken() {
  return localStorage.getItem("studymate_token");
}

// =======================
// Get Role
// =======================
export function getRole() {
  return localStorage.getItem("studymate_role");
}

// =======================
// Get Current User
// =======================
export function getCurrentUser() {
  const user = localStorage.getItem("studymate_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}