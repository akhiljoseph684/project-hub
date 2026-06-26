"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";

import {
  getPlans,
  getPlansByUser,
  updateUserPlan,
} from "@/services/subscription.service";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth, updateUser } from "@/redux/slices/authSlice";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/lib/toast";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  maxProjects: number | null;
  maxTasks: number | null;
  maxMembers: number | null;
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPlans();
    getUserPlans();
  }, []);

  const { user } = useAppSelector((state) => state.auth);

  const fetchPlans = async () => {
    try {
      const res = await getPlans();

      setPlans(res.plans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getUserPlans = async () => {
    try {
      const res = await getPlansByUser();

      setUserPlans(res.plans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      let res = await updateUserPlan(planId);
      dispatch(updateUser(res.user));
      showSuccessToast(res.message)
    } catch (error: any) {
      showErrorToast(error.message)
    }
  };
  const getLimit = (value: number | null, label: string) => {
    return value === null ? `Unlimited ${label}` : `${value} ${label}`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        {" "}
        <Loader2 className="h-8 w-8 animate-spin" />{" "}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>

        <p className="mt-2 text-muted-foreground">
          Choose the perfect plan for your team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold">{user?.plan?.name} Plan</h3>

            <p className="text-muted-foreground">
              Upgrade anytime to unlock more projects and collaboration
              features.
            </p>
          </div>

          <a href="#plans">
            <Button>
              {user?.plan?.slug !== "business" ? "Upgrade Plan" : "Change Plan"}
            </Button>
          </a>
        </CardContent>
      </Card>


      <div>
        <h2 className="mb-6 text-2xl font-bold" id="plans">
          Available Plans
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.slug === "business" ? "border-primary" : ""
              }`}
            >
              {plan.slug === "business" && (
                <Badge className="absolute right-4 top-4">Most Popular</Badge>
              )}

              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />

                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <div className="mt-5">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                </div>

                <div className="mt-8 space-y-4">
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

                <Button
                  className="mt-8 w-full"
                  onClick={() => {
                    plan.slug === "free" ||
                    userPlans.includes(plan.slug as (typeof userPlans)[number])
                      ? handleSelectPlan(plan.id)
                      : router.push("/dashboard/billing/" + plan.id);
                  }}
                  variant={
                    plan.slug === user?.plan?.slug ? "outline" : "default"
                  }
                >
                  {plan.slug === user?.plan?.slug
                    ? "Current Plan"
                    : plan.slug === "free" ||
                        userPlans.includes(
                          plan.slug as (typeof userPlans)[number],
                        )
                      ? "Select Plan"
                      : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">No payment method added</p>

              <p className="text-sm text-muted-foreground">
                Add a payment method to upgrade your subscription.
              </p>
            </div>

            <Button variant="outline">Add Card</Button>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No invoices available yet.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
