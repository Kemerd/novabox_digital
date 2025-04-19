import { useLoaderData, useParams, type MetaFunction } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

interface PageData {
  title: string;
  description: string;
  content: string;
}

interface LoaderData {
  page: PageData | null;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const pageData = data as LoaderData;
  return [
    { title: pageData?.page?.title || 'Page Not Found' },
    { description: pageData?.page?.description || 'Page description not available' },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  // This would typically fetch data from your CMS or API
  // For now, we'll return mock data based on the handle
  const pageData = getPageData(params.handle || '');
  
  if (!pageData) {
    throw new Response('Page not found', { status: 404 });
  }
  
  return json<LoaderData>({ page: pageData });
}

export default function Page() {
  const { page } = useLoaderData<LoaderData>();
  const params = useParams();

  if (!page) {
    return <div>Page not found: {params.handle}</div>;
  }

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <div 
        className="page-content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}

// Mock function to return page data
function getPageData(handle: string): PageData | null {
  const pages: Record<string, PageData> = {
    'about': {
      title: 'About Us',
      description: 'Learn about our company',
      content: '<p>This is the about us page content.</p>'
    },
    'contact': {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      content: '<p>This is the contact page content.</p>'
    },
    'terms': {
      title: 'Terms of Service',
      description: 'Our terms of service',
      content: '<p>This is the terms of service content.</p>'
    },
    'privacy': {
      title: 'Privacy Policy',
      description: 'Our privacy policy',
      content: '<p>This is the privacy policy content.</p>'
    }
  };
  
  return pages[handle] || null;
}
