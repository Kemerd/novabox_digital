import { redirect } from '@remix-run/server-runtime';

/**
 * Redirect all sitemap requests to the static sitemap file
 */
export async function loader() {
  return redirect('/sitemap.xml', {
    headers: {
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
