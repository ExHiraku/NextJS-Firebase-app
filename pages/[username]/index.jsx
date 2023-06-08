import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { getPostsForUser, getUserWithUsername, postToJSON } from "@/lib/firebase";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    // JSON serialisable data
    let user = null;
    let posts = null;
    let postQuery = null;

    if (userDoc) {
        user = userDoc.data();
        postQuery = await getPostsForUser(username);
        posts = postQuery.map(postToJSON);
    }

    return {
        props: { user, posts }, // Will be passed to the page component as props
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    )
}