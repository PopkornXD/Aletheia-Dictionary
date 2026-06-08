import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	cookies.delete('user_id', { path: '/' });
	throw redirect(302, '/');
}
