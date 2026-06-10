import { page } from '$app/state';
import { query } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';


export async function load({ params, locals }) {
  const project_id = Number(params.project_id);

  const pages = await query(
    `SELECT pg.id, pg.name, pg.text
     FROM page pg
     JOIN project_pages pp ON pp.page_id = pg.id
     WHERE pp.project_id = ?
     ORDER BY pg.id ASC`,
    [project_id]
  );

  const sources = await query(
    `SELECT ps.page_id, ps.source_id
     FROM page_sources ps
     JOIN project_pages pp ON pp.page_id = ps.page_id
     WHERE pp.project_id = ?`,
    [project_id]
  );

  return { pages, sources };
}


export const actions = {
  newPage: async ({ request, locals, params }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: 'Not logged in' });
 
    const project_id = Number(params.project_id);
    const data = await request.formData();
    const name = data.get('name');
 
    if (!name) return fail(400, { pageError: 'Page name is required' });
 
    const permission = await query(
      `SELECT role FROM permissions WHERE user_id = ? AND project_id = ?`,
      [user.id, project_id]
    );
    if (!permission || permission.role === 'viewer') {
      return fail(403, { pageError: 'You do not have permission to add pages' });
    }
 
    const result = await query(
      `INSERT INTO page (name, text) VALUES (?, '')`,
      [name]
    );
    const page_id = result.insertId;
 
    await query(
      `INSERT INTO project_pages (project_id, page_id) VALUES (?, ?)`,
      [project_id, page_id]
    );
 
    throw redirect(303, `/${project_id}`);
  },

  editPage: async ({ request, locals, params }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: 'Not logged in' });

    const project_id = Number(params.project_id);

    const permission = await query(
      `SELECT role FROM permissions WHERE user_id = ? AND project_id = ?`,
      [user.id, project_id]
    );
    if (!permission || permission.role === 'viewer') {
      return fail(403, { pageError: 'You do not have permission to edit pages' });
    }

    const data = await request.formData();
    const page_id = Number(data.get('page_id'));
    const name = data.get('name');
    const text = data.get('text');

    if (!page_id) return fail(400, { pageError: 'Page ID is required' });
    if (!name) return fail(400, { pageError: 'Page name is required' });

    await query(
      `UPDATE page SET name = ?, text = ? WHERE id = ?`,
      [name, text, page_id]
    );

    return { success: true };
  },

  addSource: async ({ request, locals, params }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: 'Not logged in' });

    const project_id = Number(params.project_id);

    const permission = await query(
      `SELECT role FROM permissions WHERE user_id = ? AND project_id = ?`,
      [user.id, project_id]
    );
    if (!permission || permission.role === 'viewer') {
      return fail(403, { error: 'No permission' });
    }

    const data = await request.formData();
    const page_id = Number(data.get('page_id'));
    const source_id = Number(data.get('source_id'));

    if (!page_id || !source_id) return fail(400, { error: 'Missing IDs' });
    if (page_id === source_id) return fail(400, { error: 'A page cannot source itself' });

    await query(
      `INSERT IGNORE INTO page_sources (page_id, source_id) VALUES (?, ?)`,
      [page_id, source_id]
    );

    return { success: true };
  },

  removeSource: async ({ request, locals, params }) => {
    const user = locals.user;
    if (!user) return fail(401, { error: 'Not logged in' });

    const project_id = Number(params.project_id);

    const permission = await query(
      `SELECT role FROM permissions WHERE user_id = ? AND project_id = ?`,
      [user.id, project_id]
    );
    if (!permission || permission.role === 'viewer') {
      return fail(403, { error: 'No permission' });
    }

    const data = await request.formData();
    const page_id = Number(data.get('page_id'));
    const source_id = Number(data.get('source_id'));

    if (!page_id || !source_id) return fail(400, { error: 'Missing IDs' });

    await query(
      `DELETE FROM page_sources WHERE page_id = ? AND source_id = ?`,
      [page_id, source_id]
    );

    return { success: true };
  }
};