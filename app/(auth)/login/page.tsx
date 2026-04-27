import type { Metadata } from "next";
import { BrandLogo, DecorativeCards, LoginForm, SidePanel } from "@/features/auth";
import { getBornesCount, getUsersCount } from "@/features/auth/api";

export const metadata: Metadata = {
  title: "Connexion",
};

export default async function LoginPage() {
  const [bornesCount, usersCount] = await Promise.all([getBornesCount(), getUsersCount()]);

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <section className="relative flex flex-col overflow-hidden bg-background">
        <DecorativeCards />
        <div className="relative z-10 flex flex-1 flex-col px-6 py-10 sm:px-12">
          <BrandLogo />
          <div className="flex flex-1 items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </section>
      <SidePanel bornesCount={bornesCount} usersCount={usersCount} />
    </div>
  );
}
