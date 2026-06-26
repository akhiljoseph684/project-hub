import api from "@/lib/axios";

export const getPlans = async () => {
  try {
    const res = await api.get("/subscription");
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};

export const getPlanById = async (id: string) => {
  try {
    const res = await api.get(`/subscription/${id}`);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};

export const createOrder = async (planId: string) => {
  try {
    const response = await api.post("/subscription/create-order", {
      planId,
    });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};

export const verifyPayment = async (data: {
  planId: string;

  razorpay_order_id: string;

  razorpay_payment_id: string;

  razorpay_signature: string;
}) => {
  try {
    const response = await api.post("/subscription/verify-payment", data);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};

export const getPlansByUser = async () => {
  try {
    const response = await api.get("/subscription/my-plans");
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};
export const updateUserPlan = async (planId: string) => {
  try {
    const res = await api.patch("/subscription/" + planId);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: "Somthing went wrong",
      }
    );
  }
};
