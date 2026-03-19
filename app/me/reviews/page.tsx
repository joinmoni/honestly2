import { MyReviewsScreen } from "@/components/my-reviews/MyReviewsScreen";
import { getMyReviewsPageData } from "@/lib/services/my-reviews";
import { getRatingCriteria } from "@/lib/services/reviews";
import { getCurrentSession, requireUserSession } from "@/lib/services/session";

export default async function MyReviewsPage() {
  const user = await requireUserSession("/me/reviews");
  const session = await getCurrentSession();

  const [data, criteria] = await Promise.all([
    getMyReviewsPageData(user.id),
    getRatingCriteria()
  ]);

  return <MyReviewsScreen data={data} criteria={criteria} session={session} />;
}
