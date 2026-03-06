import { redirect } from "next/navigation";
import { MyReviewsScreen } from "@/components/my-reviews/MyReviewsScreen";
import { getMyReviewsPageData } from "@/lib/services/my-reviews";
import { getRatingCriteria } from "@/lib/services/reviews";
import { getMockSession } from "@/lib/services/session";

export default async function MyReviewsPage() {
  const session = await getMockSession();

  if (!session.user) {
    redirect("/login");
  }

  const [data, criteria] = await Promise.all([
    getMyReviewsPageData(session.user.id),
    getRatingCriteria()
  ]);

  return <MyReviewsScreen data={data} criteria={criteria} session={session} />;
}
