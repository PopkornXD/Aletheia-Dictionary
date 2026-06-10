import { fail, redirect } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function load({ locals }) {
  const user = locals?.user;

  const projects = await query(
    `SELECT p.id, p.name, p.created_at, pr.role
     FROM projects p
     JOIN permissions pr ON pr.project_id = p.id
     WHERE pr.user_id = ?
     ORDER BY p.created_at DESC`,
    [user?.id || -1]
  );

  return {
    user: user,
    projects
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
      return fail(401, { error: 'Not logged in' });
    }

    const data = await request.formData();
    const name = data.get('name');

    if (!name) {
      return fail(400, { error: 'Project name is required' });
    }

    const result = await query(
      `INSERT INTO projects (name) VALUES (?)`,
      [name]
    );
    const projectId = result.insertId;

    await query(
      `INSERT INTO permissions (user_id, project_id, role) VALUES (?, ?, 'admin')`,
      [user.id, projectId]
    );

    throw redirect(303, `/${projectId}`);
  }
};