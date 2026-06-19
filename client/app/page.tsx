"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import GuestRoute from "@/components/GuestRoute";

export default function LandingPage() {
  const router = useRouter();

  return (
    <GuestRoute>
      <main className="min-h-screen bg-background text-foreground">
        {" "}
        <nav className="border-b">
          {" "}
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <Image
                src="/project_hub_logo.png"
                alt="ProjectHub"
                width={36}
                height={36}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="text-base font-bold sm:text-xl">ProjectHub</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <button
                onClick={() => router.push("/login")}
                className="
                rounded-lg
                px-3
                py-2
                text-xs
                sm:text-sm
                font-medium
                transition-all
                hover:bg-muted
              "
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                className="
                rounded-lg
                bg-blue-600
                px-3
                sm:px-4
                py-2
                text-xs
                sm:text-sm
                font-medium
                text-white
                shadow-md
                transition-all
                hover:bg-blue-700
              "
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
        <section className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex justify-center">
              <Image
                src="/project_hub_logo_with_name.png"
                alt="ProjectHub"
                width={240}
                height={80}
                className="
                h-auto
                w-[180px]
                sm:w-[220px]
                md:w-[280px]
              "
              />
            </div>

            <h1
              className="mb-5
              text-3xl
              font-extrabold
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            "
            >
              Organize Projects.
              <br />
              Collaborate Better.
            </h1>

            <p
              className="mx-auto
              mb-8
              max-w-xl
              text-sm
              text-muted-foreground
              sm:text-base
              lg:text-lg
            "
            >
              ProjectHub helps teams manage projects, tasks, sprints, workflows,
              and collaboration from a single workspace built for modern teams.
            </p>

            <div
              className="flex
                  w-full
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
            >
              <button
                onClick={() => router.push("/register")}
                className="
            group
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:bg-blue-700
          "
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="
            rounded-xl
            px-8
            py-3
            font-semibold
            transition-all
            duration-300
            hover:bg-muted
            hover:scale-105
          "
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </main>
    </GuestRoute>
  );
}
