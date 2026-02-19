import fs from 'fs';
import path from 'path';
import Description from '@/components/Description';
import Link from 'next/link';

interface BlogPostPageProps {
  params: { slug: string };
}

const BLOG_DIR = path.join(process.cwd(), 'content');

function getPostContent(slug: string) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

interface PostMetadata {
  title: string;
  date: string;
  slug: string;
  [key: string]: any;
}

function parseMarkdownWithFrontmatter(content: string): { metadata: PostMetadata; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    // If no frontmatter, treat the entire content as the body
    return {
      metadata: {
        title: '',
        date: new Date().toISOString(),
        slug: ''
      },
      content: content.trim()
    };
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  
  // Parse frontmatter (simple key-value pairs)
  const metadata: PostMetadata = {
    title: '',
    date: '',
    slug: ''
  };

  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value: any = match[2].trim();
      
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      (metadata as any)[key] = value;
    }
  });

  return { metadata, content: body };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const markdownContent = getPostContent(params.slug);
  
  if (!markdownContent) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold">404 - Blog post not found</h1>
        <p className="mt-4">The requested blog post could not be found.</p>
        <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }
  
  const { metadata, content } = parseMarkdownWithFrontmatter(markdownContent);
  const title = metadata.title || params.slug.replace(/-/g, ' ');
  return (
    <main className="flex justify-center px-2 sm:px-4">
      <article className="prose prose-base sm:prose-lg md:prose-xl lg:prose-2xl max-w-full sm:max-w-2xl w-full bg-white/90 rounded-lg shadow-lg p-4 sm:p-8 my-8 sm:my-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center mb-4 sm:mb-6 text-blue-600 hover:underline text-base sm:text-lg"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Blog
        </Link>
        
        <header className="mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-gray-900">
            {title}
          </h1>
          {metadata.date && (
            <p className="text-gray-500 text-sm sm:text-base">
              {new Date(metadata.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>
        
        <div className="prose prose-sm sm:prose-base max-w-none">
          <Description markdownContent={content} />
        </div>
      </article>
    </main>
  );
}