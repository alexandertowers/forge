import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    debugger;
  // Get hostname (e.g. tenant-a.yourdomain.com or tenant-a.vercel.app)
  const hostname = request.headers.get('host') || '';
  
  // Skip for API routes and static files
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return;
  }
  
  // Extract subdomain (tenant)
  const currentHost = hostname.split(':')[0];
  const domainParts = currentHost.split('.');
  
  // For Vercel preview deployments using `*.vercel.app` domains
  // or for localhost development
  const isVercelPreview = hostname.includes('forgewealth.app');
  //log
    console.log('isVercelPreview', isVercelPreview);
  const isLocalhost = hostname.includes('localhost');
  let subdomain: string | null = null;
  
  if (isVercelPreview) {
    // tenant-name.project-name.vercel.app
    // The subdomain would be in the first position
    subdomain = domainParts[0];
  } else if (isLocalhost) {
    // For localhost, extract from path instead (e.g. localhost:3000/tenant-name)
    const pathSegments = request.nextUrl.pathname.split('/');
    subdomain = pathSegments[1] || null;
    
    // Skip rewrite if we're on the root path
    if (pathSegments.length <= 1) {
      return;
    }
  } else {
    // Production with custom domain: tenant.yourdomain.com
    // Only consider it a subdomain if we have at least 3 parts (tenant.domain.tld)
    if (domainParts.length >= 3) {
      subdomain = domainParts[0];
    }
  }
  
  // If we identified a subdomain, rewrite the request
  if (subdomain && subdomain !== 'www') {
    // log
    console.log('subdomain', subdomain);
    const path = isLocalhost 
      ? request.nextUrl.pathname.replace(`/${subdomain}`, '') || '/'
      : request.nextUrl.pathname;
      
    return NextResponse.rewrite(
      new URL(`/_tenants/${subdomain}${path}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (public files)
     * 4. favicon.ico, etc
     */
    '/((?!api|_next|static|favicon.ico).*)',
  ],
};
