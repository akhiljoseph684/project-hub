import api from "@/lib/axios";

export interface RegisterPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const res = await api.post("/auth/register", data);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Registration failed",
      }
    );
  }
};

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginPayload) => {
  try {
    const res = await api.post("/auth/login", data);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Login failed",
      }
    );
  }
};

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtp = async (data: VerifyOtpPayload) => {
  try {
    const res = await api.post("/auth/verify-otp", data);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "OTP verification failed",
      }
    );
  }
};

export interface ResendOtpPayload {
  email: string;
}

export const resendOtp = async (data: ResendOtpPayload) => {
  try {
    const res = await api.post("/auth/resend-otp", data);

    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to resend OTP",
      }
    );
  }
};
