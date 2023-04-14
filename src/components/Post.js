/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useState, useEffect} from 'react';
import {getAuthor, getFeaturedImage} from '../../lib/utils';
import parse from 'html-react-parser';

export default function Post({post}) {
	const [postImgAndAuthor, setPostImgAndAuthor] = useState({
		featImgUrl: '',
		author: '',
	});

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			const author = getAuthor(post.author);
			const featuredImg = getFeaturedImage(post.featured_media);
			//   resolve the promises in getAuthor and getFeaturedImg async functions using Promise.all
			Promise.all([author, featuredImg]).then((res) => {
				setPostImgAndAuthor({
					author: res[0],
					featImgUrl: res[1],
				});
			});
		}
		return () => {
			mounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='box-border'>
			<img
				className='excerpt-img mb-5'
				src={
					postImgAndAuthor ? postImgAndAuthor.featImgUrl : '/MBM_icon_R.jpeg'
				}
				alt='featured image'
			/>

			<Link href={`/post/${post.id}`} className='text-2xl font-bold'>
				{post.title.rendered}
			</Link>

			<h3 className='text-md my-3 italic'>
				{new Date(post.date).toDateString()}
			</h3>

			<div className='relative mt-3'>
				<div className='mb-3 max-w-lg'>{parse(post.excerpt.rendered)}</div>
				<Link href={`/post/${post.id}`} className='bottom-0 mt-3 text-blue-800'>
					Continue reading
				</Link>
			</div>
		</div>
	);
}
