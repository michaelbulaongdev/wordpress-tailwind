import Head from 'next/head';
import Post from '../components/Post';
import Footer from '../components/Footer';
import {useState, useEffect} from 'react';
import {getAllPostsFromServer} from '../../lib/utils';

export default function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		let mounted = true;

		const fetchData = async () => {
			if (mounted) {
				const postsFromServer = await getAllPostsFromServer();
				setPosts(postsFromServer);
			}
		};
		fetchData();

		return () => (mounted = false);
	}, []);

	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<Head>
				<title>WP Next Tailwind</title>
				<link rel='icon' href='/MBM.ico' />
			</Head>
			<main className='flex flex-1 flex-col items-center px-20 py-10'>
				<h1 className='mb-5 mt-5 text-6xl font-bold'>Hello NextJS</h1>
				<p className='mb-10 text-2xl italic'>
					WordPress as a Headless CMS with NextJS
				</p>
				{posts && (
					<div className='grid grid-cols-1 gap-10'>
						{posts.map((post, id) => {
							return (
								<div key={id}>
									<Post post={post} />
								</div>
							);
						})}
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
