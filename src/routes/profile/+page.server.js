import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const projects = await query(
	`SELECT p.id, p.name, p.created_at, pr.role
		FROM projects p
		JOIN permissions pr ON pr.project_id = p.id
		WHERE pr.user_id = ?
		ORDER BY p.created_at DESC`,
	[user?.id || -1]
	);

	return {
		user: locals.user,
		projects: projects
	};
}
