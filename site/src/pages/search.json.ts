import { getCollection } from 'astro:content';
import { loadProblems, loadMarkdownDir, slugify } from '../utils/content';

export async function GET() {
  const problems = loadProblems();
  const notes = await getCollection('notes');
  const templates = await getCollection('templates');

  const searchIndex = [];

  // Add problems with rich tag metadata
  for (const p of problems) {
    searchIndex.push({
      title: p.title,
      type: 'Problem',
      difficulty: p.difficulty,
      url: `/problems/${p.slug}`,
      // All tags flattened for general search
      tags: [
        ...p.topics,
        ...p.companies,
        ...p.platforms,
        ...p.otherTags,
        ...p.groups,
        p.difficulty
      ].filter(Boolean),
      // Separate tag categories for #tag search
      topics: p.topics,
      companies: p.companies,
      platforms: p.platforms,
      otherTags: p.otherTags,
      groups: p.groups,
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
      tags: [parts[0]],
      topics: [],
      companies: [],
      platforms: [],
      otherTags: [],
      groups: [],
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
      topics: [],
      companies: [],
      platforms: [],
      otherTags: [],
      groups: [],
    });
  }

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
