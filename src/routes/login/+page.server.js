import { query } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { error: 'Username and password are required', username, password });
		}

		try {
			// Get user by username
			const users = await query('SELECT * FROM users WHERE username = ?', [username]);

			if (users.length === 0) {
				return fail(401, { error: 'Invalid username or password', username, password });
			}

			const user = users[0];

			// Verify password with bcrypt
			let passwordMatch;
			try {
				passwordMatch = await bcrypt.compare(password, user.password);
			} catch (bcryptError) {
				console.error('Bcrypt compare error:', bcryptError.message);
				throw bcryptError;
			}

			if (!passwordMatch) {
				return fail(401, { error: 'Invalid username or password', username, password });
			}

			// Set session cookie (in production, use proper session management)
			cookies.set('user_id', user.id.toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Redirect to home page
			throw redirect(302, '/');
		} catch (error) {
			if (error.status === 302) throw error; // Re-throw redirects
			console.error('Login error details:', {
				message: error.message,
				stack: error.stack,
				code: error.code
			});
			return fail(500, { error: 'Login failed: ' + error.message, username, password });
		}
	}
};
