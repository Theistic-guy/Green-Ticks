import { getCollection } from 'astro:content';
import { loadProblems, slugify, extractFrontmatterTags } from '../utils/content';

export async function GET() {
  const problems = loadProblems();
  const notes = await getCollection('notes');
  const templates = await getCollection('templates');
  const writeUps = await getCollection('write-ups').catch(() => []);

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

  // Add notes with their Obsidian frontmatter tags
  for (const note of notes) {
    if (note.id.includes('To-Do or Wishlist') || note.id.toLowerCase().includes('readme')) continue;

    const parts = note.id.split('/');
    const slug = parts.map(slugify).join('/');
    const rawFileName = parts[parts.length - 1].replace(/\.md$/, '');
    const title = note.data.Title || rawFileName.replace(/-/g, ' ');
    const noteTags = extractFrontmatterTags(note.data);
    const folderTag = parts.length > 1 ? parts[0] : '';
    const allNoteTags = [...new Set([...noteTags, folderTag].filter(Boolean))];
    
    searchIndex.push({
      title: title,
      type: 'Note',
      url: `/notes/${slug}`,
      tags: allNoteTags,
      topics: [],
      companies: [],
      platforms: [],
      otherTags: [],
      obsidianTags: noteTags,
      groups: [],
    });
  }

  // Add templates with their frontmatter tags
  for (const temp of templates) {
    if (temp.id.toLowerCase().includes('readme')) continue;

    const parts = temp.id.split('/');
    const slug = parts.map(slugify).join('/');
    const rawFileName = parts[parts.length - 1].replace(/\.md$/, '');
    const title = temp.data.Title || rawFileName.replace(/-/g, ' ');
    const tempTags = extractFrontmatterTags(temp.data);
    const folderTag = parts.length > 1 ? parts[0] : '';
    const allTempTags = [...new Set(['Template', ...tempTags, folderTag].filter(Boolean))];
    
    searchIndex.push({
      title: title,
      type: 'Template',
      url: `/templates/${slug}`,
      tags: allTempTags,
      topics: [],
      companies: [],
      platforms: [],
      otherTags: [],
      obsidianTags: tempTags,
      groups: [],
    });
  }

  // Add write-ups with their frontmatter tags
  for (const wu of writeUps) {
    if (wu.id.toLowerCase().includes('readme') || wu.id.includes('.gitkeep')) continue;

    const parts = wu.id.split('/');
    const slug = parts.map(slugify).join('/');
    const rawFileName = parts[parts.length - 1].replace(/\.md$/, '');
    const title = wu.data.Title || rawFileName.replace(/-/g, ' ');
    const wuTags = extractFrontmatterTags(wu.data);
    const folderTag = parts.length > 1 ? parts[0] : '';
    const allWuTags = [...new Set(['Write-Up', ...wuTags, folderTag].filter(Boolean))];

    searchIndex.push({
      title: title,
      type: 'Write-Up',
      url: `/write-ups/${slug}`,
      tags: allWuTags,
      topics: [],
      companies: [],
      platforms: [],
      otherTags: [],
      obsidianTags: wuTags,
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
