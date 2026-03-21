import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const contentDir = path.join(process.cwd(), 'content');

// Ensure content directory exists
async function ensureContentDir() {
  try {
    await fs.mkdir(contentDir, { recursive: true });
  } catch (error) {
    console.error('Error creating content directory:', error);
    throw error;
  }
}

// Helper function to check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('isAuthenticated')?.value === 'true';
  if (!isAuthenticated) {
    return { error: 'Not authenticated', status: 401 };
  }
  return null;
}

export async function POST(request: Request) {
  // Check authentication
  const authError = await checkAuth();
  if (authError) {
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    );
  }

  try {
    const { title, content, slug } = await request.json();
    
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    await ensureContentDir();
    
    // Create a slug from the title if not provided
    const postSlug = slug || title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/--+/g, '-');      // Replace multiple - with single -

    const fileName = `${postSlug}.md`;
    const filePath = path.join(contentDir, fileName);
    
    // Format the content with frontmatter
    const frontmatter = `---
title: "${title}"
date: ${new Date().toISOString()}
slug: ${postSlug}
---

${content}`;

    await fs.writeFile(filePath, frontmatter, 'utf-8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post saved successfully',
      path: filePath
    });
    
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json(
      { error: 'Failed to save blog post' },
      { status: 500 }
    );
  }
}

// Add PUT method for updating blog posts
export async function PUT(request: Request) {
  try {
    // Check authentication
    const authError = await checkAuth();
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

    const { originalSlug, title, content, slug } = await request.json();
    
    if (!originalSlug || !title || !content || !slug) {
      return NextResponse.json(
        { error: 'Original slug, title, content, and slug are required' },
        { status: 400 }
      );
    }

    await ensureContentDir();
    
    // If slug changed, delete the old file
    if (originalSlug !== slug) {
      const oldFilePath = path.join(contentDir, `${originalSlug}.md`);
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
      }
    }

    const fileName = `${slug}.md`;
    const filePath = path.join(contentDir, fileName);
    
    // Format the content with frontmatter
    const frontmatter = `---
title: "${title}"
date: ${new Date().toISOString()}
slug: ${slug}
---

${content}`;

    await fs.writeFile(filePath, frontmatter, 'utf-8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post updated successfully',
      path: filePath
    });
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// Add DELETE method for deleting blog posts
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const authError = await checkAuth();
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

    const { slug } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(contentDir, `${slug}.md`);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    await fs.unlink(filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureContentDir();
    
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    // Read each file and extract frontmatter
    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (match) {
          const frontmatter = match[1];
          const body = match[2];
          const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
          const slugMatch = frontmatter.match(/slug:\s*([^\s\n]+)/);
          const dateMatch = frontmatter.match(/date:\s*([^\s\n]+)/);
          
          return {
            title: titleMatch ? titleMatch[1] : file.replace(/\.md$/, ''),
            slug: slugMatch ? slugMatch[1] : file.replace(/\.md$/, ''),
            date: dateMatch ? dateMatch[1] : new Date().toISOString(),
            content: body.trim()
          };
        }
        
        return {
          title: file.replace(/\.md$/, ''),
          slug: file.replace(/\.md$/, ''),
          date: new Date().toISOString(),
          content: content.trim()
        };
      })
    );
    
    return NextResponse.json(posts);
    
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to read blog posts' },
      { status: 500 }
    );
  }
}
