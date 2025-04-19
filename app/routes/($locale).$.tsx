import { useRouteError } from '@remix-run/react';

export async function loader() {
  throw new Response(`Not found`, {
    status: 404,
  });
}

export default function NotFoundPage() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="error-container">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="button">Back to Home</a>
    </div>
  );
}
