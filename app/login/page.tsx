import { AuthScreen } from "@/components/auth/AuthScreen";
import { getAuthPageCopy } from "@/lib/services/auth-page";

export default async function LoginPage() {
  const copy = await getAuthPageCopy();
  return <AuthScreen copy={copy} />;
}
