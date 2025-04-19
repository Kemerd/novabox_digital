import { redirect } from '@remix-run/server-runtime';

/**
 * Redirect to static robots.txt file
 */
export async function loader() {
  return redirect('/robots.txt', {
    headers: {
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
