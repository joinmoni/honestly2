import { AuthScreen } from "@/components/auth/AuthScreen";
import { getAuthPageCopy } from "@/lib/services/auth-page";
import { normalizeRedirectPath } from "@/lib/services/session";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const copy = await getAuthPageCopy();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextPath = normalizeRedirectPath(resolvedSearchParams?.next);

  return <AuthScreen copy={copy} nextPath={nextPath} />;
}
