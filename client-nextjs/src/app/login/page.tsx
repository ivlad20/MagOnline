import AuthConsole from "@/components/AuthConsole";

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-100px)] items-center justify-center overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-seal px-4 py-16">
      <span className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-crimson/30 blur-3xl" />
      <span className="absolute -right-16 bottom-0 -z-10 h-96 w-96 rounded-full bg-seal-light/30 blur-3xl" />
      <AuthConsole />
    </div>
  );
}
