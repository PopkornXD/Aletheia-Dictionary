import { query } from '$lib/db';

export async function handle({ event, resolve }) {
	// Initialize locals
	event.locals.user = null;

	const userId = event.cookies.get('user_id');

	if (userId) {
		try {
			const users = await query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
			if (users.length > 0) {
				event.locals.user = users[0];
			}
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	}

	const response = await resolve(event);
	return response;
}
