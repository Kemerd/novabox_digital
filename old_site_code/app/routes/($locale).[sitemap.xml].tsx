import { redirect } from '@remix-run/server-runtime';

/**
 * A simple redirect to the static sitemap file
 */
export async function loader() {
  return redirect('/sitemap.xml', {
    headers: {
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
