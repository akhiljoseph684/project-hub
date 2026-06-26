"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Crown, Loader2 } from "lucide-react";

import {
  createOrder,
  getPlanById,
  verifyPayment,
} from "@/services/subscription.service";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showErrorToast } from "@/lib/toast";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  maxProjects: number | null;
  maxTasks: number | null;
  maxMembers: number | null;
}

export default function PlanCheckoutPage() {
  const params = useParams();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await getPlanById(params.id as string);

      if (response.success) {
        setPlan(response.plan);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getLimit = (value: number | null, label: string) => {
    return value === null ? `Unlimited ${label}` : `${value} ${label}`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return <div className="text-center">Plan not found</div>;
  }

  const handlePayment = async () => {
    try {
      const res = await createOrder(plan.id);

      const order = res.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "ProjectHub",

        description: `${plan.name} Plan`,

        handler: async (payment: any) => {
          await verifyPayment({
            planId: plan.id,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error: any) {
      showErrorToast(error.message)
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-2 text-muted-foreground">Review your selected plan.</p>
      </div>

      <Card className="relative">
        {plan.slug === "business" && (
          <Badge className="absolute right-4 top-4">Most Popular</Badge>
        )}

        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />

            <CardTitle>{plan.name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-8">
            <span className="text-5xl font-bold">₹{plan.price}</span>

            <span className="text-muted-foreground">/month</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />

              <span>{getLimit(plan.maxProjects, "Projects")}</span>
            </div>

            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />

              <span>{getLimit(plan.maxTasks, "Tasks")}</span>
            </div>

            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />

              <span>{getLimit(plan.maxMembers, "Members")}</span>
            </div>
          </div>

          <div className="mt-8 rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Plan Price</span>

              <span>₹{plan.price}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>Tax</span>

              <span>₹0</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
              <span>Total</span>

              <span>₹{plan.price}</span>
            </div>
          </div>

          <Button className="mt-6 w-full" onClick={handlePayment}>
            Proceed To Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
