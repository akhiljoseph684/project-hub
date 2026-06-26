import prisma from "../../config/prisma.js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const getPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const duplicate = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        planId,
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "You have already subscribed to this plan.",
      });
    }

    const order = await razorpay.orders.create({
      amount: Number(plan.price) * 100,
      currency: "INR",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    if (!verified) {
      return res.status(400).json({
        success: false,
      });
    }

    const userId = req.user.id;

    await prisma.subscription.updateMany({
      where: {
        userId,
        isActive: true,
      },

      data: {
        isActive: false,
      },
    });

    await prisma.subscription.create({
      data: {
        userId,
        planId,
        isActive: true,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        planId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Subscription activated",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

export const getPlansByUser = async (req, res) => {
  try {
    const plans = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        plan: {
          select: {
            slug: true,
          },
        },
      },
    });

    const slugs = plans.map((item) => item.plan.slug);

    return res.status(200).json({
      success: true,
      plans: slugs,
    });

    return res.status(200).json({
      success: true,
      plans: subscriptions.map((subscription) => subscription.plan),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans.",
    });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required.",
      });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        planId,
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        plan: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Subscription plan changed successfully.",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subscription plan.",
    });
  }
};
