import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import type { Metadata } from "next";

// ✅ DO NOT define a custom `Props` type — Next.js now enforces a specific signature

export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata | undefined> {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// ✅ Page must be the default export and directly use `params`
export default async function Page(
  { params }: { params: { username: string } }
) {
  const user = await getProfileByUsername(params.username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
