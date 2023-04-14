/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import parse from 'html-react-parser';
import Head from 'next/head';
import Footer from '../../components/Footer';
import {POSTS_API_URL} from '../../lib/constants';
import {getAuthor, getFeaturedImage} from '../../lib/utils';

export default function Post({title, featuredImg, author, content, date}) {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center'>
			<Head>
				<title>{title}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='m-auto mx-5 flex max-w-5xl flex-1 flex-col items-center py-10 md:px-20'>
				<h1 className='mb-5 mt-5 text-center text-3xl font-bold md:text-6xl'>
					{title}
				</h1>
				<div>
					<img src={featuredImg} alt='featured image' />
				</div>
				<p className='mt-5 text-sm'>Written by {author}</p>
				<p className='mb-5 text-sm font-semibold'>
					Published on {new Date(date).toDateString()}
				</p>
				<div className='text-md mt-5'>{parse(content)}</div>
			</main>
			<Footer />
		</div>
	);
}

// This function gets called at build time
export async function getStaticPaths() {
	const res = await axios.get(POSTS_API_URL);
	const posts = res.data;

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post) => ({
		params: {id: post.id.toString()},
	}));

	// We'll pre-render only these paths at build time.
	return {paths, fallback: false};
}

// This also gets called at build time
export async function getStaticProps({params}) {
	const res = await axios.get(`${POSTS_API_URL}/${params.id}`);
	const post = await res.data;

	const featuredImg = await getFeaturedImage(post.featured_media);
	const author = await getAuthor(post.author);

	return {
		props: {
			title: post.title.rendered,
			content: post.content.rendered,
			featuredImg,
			author,
			date: post.date,
		},
	};
}
