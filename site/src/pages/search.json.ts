import { getCollection } from 'astro:content';
import { loadProblems, loadMarkdownDir, slugify } from '../utils/content';

export async function GET() {
  const problems = loadProblems();
  const notes = await getCollection('notes');
  const templates = await getCollection('templates');

  const searchIndex = [];

  // Add problems
  for (const p of problems) {
    searchIndex.push({
      title: p.title,
      type: 'Problem',
      url: `/problems/${p.slug}`,
      tags: [...p.topics, ...p.companies, ...p.platforms, p.difficulty].filter(Boolean),
      // We don't include full rawContent to keep the JSON small, 
      // but we could include a snippet or let Fuse search the title + tags.
    });
  }

  // Add notes
  for (const note of notes) {
    const parts = note.id.split('/');
    const slug = parts.map(slugify).join('/');
    const title = note.data.Title || parts[parts.length - 1].replace(/-/g, ' ');
    
    searchIndex.push({
      title: title,
      type: 'Note',
      url: `/notes/${slug}`,
      tags: [parts[0]], // Folder name as a tag
    });
  }

  // Add templates
  for (const temp of templates) {
    const parts = temp.id.split('/');
    const slug = parts.map(slugify).join('/');
    const title = temp.data.Title || parts[parts.length - 1].replace(/-/g, ' ');
    
    searchIndex.push({
      title: title,
      type: 'Template',
      url: `/templates/${slug}`,
      tags: ['Template', parts.length > 1 ? parts[0] : ''].filter(Boolean),
    });
  }

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
