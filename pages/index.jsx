import toast from "react-hot-toast";

import Loader from '@/components/Loader';
import { getPosts, postToJSON } from '@/lib/firebase';


export async function getServerSideProps(context) {
	let postQuery = null;
	let posts = null;

	postQuery = await getPosts(1);
	posts = postQuery.map(postToJSON);

	return {
		props: { posts },
	};
}

export default function Home() {
	return (
		<div>
			<button onClick={() => toast.success('Hello Toast!')}>
				<h1>Toast!</h1>
			</button>
			<Loader show />
		</div>
	)
}
