import { query } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const email = data.get('email');

		// Validation
		if (!username || !password || !email) {
			return fail(400, { error: 'All fields are required', username, email, password });
		}

		try {
			// Check if user already exists
			const existingUsername = await query('SELECT * FROM users WHERE username = ?', [username]);
			if (existingUsername.length > 0) {
				return fail(400, { error: 'Username already exists', username, email, password });
			}

            const existingEmail = await query('SELECT * FROM users WHERE email = ?', [email]);
			if (existingEmail.length > 0) {
				return fail(400, { error: 'Email already exists', username, email, password });
			}

			// Hash password with bcrypt (10 salt rounds)
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create user with hashed password
			await query(
				'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())',
				[username, hashedPassword, email]
			);

			// Redirect to login page
			throw redirect(302, '/login');
		} catch (error) {
			if (error.status === 302) throw error; // Re-throw redirects
			console.error('Signup error:', error);
			return fail(500, { error: 'Failed to create user', username, email, password });
		}
	}
};
