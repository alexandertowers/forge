import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/:domain(.+)', '/tenants/:tenant(.+)']);

async function tenantMiddleware(request: NextRequest, auth: any) {
  const hostname = request.headers.get('host') || '';
  
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.next();
  }
  
  // Extract subdomain (tenant)
  const currentHost = hostname.split(':')[0];
  const domainParts = currentHost.split('.');
  
  const isVercelPreview = hostname.includes('forgewealth.app');
  const isLocalhost = hostname.includes('localhost');
  let tenantId: string | null = null;
  
  if (isVercelPreview) {
    // tenant-name.forgewealth.app
    tenantId = domainParts[0];
  } else if (isLocalhost) {
    // For localhost, extract from path instead (e.g. localhost:3000/tenant-name)
    const pathSegments = request.nextUrl.pathname.split('/');
    tenantId = pathSegments[1] || null;
    
    // Skip rewrite if we're on the root path
    if (pathSegments.length <= 1) {
      return NextResponse.next();
    }
  } else {
    // Production with custom domain: tenant.yourdomain.com
    if (domainParts.length >= 3) {
      tenantId = domainParts[0];
    }
  }

  // If we identified a tenant, rewrite the request
  if (tenantId && tenantId !== 'www') {
    const clerk = await clerkClient();

    const { orgId }= await auth();

    const org = await clerk.organizations.getOrganization({ organizationId: orgId });

    const hasAccess = org.name === tenantId;
    if (!hasAccess) {
      console.error('User memberships do not grant access to tenant:', tenantId);
      return NextResponse.redirect(new URL(`/`, request.url));
        }


    try {
      const path = isLocalhost 
        ? request.nextUrl.pathname.replace(`/${tenantId}`, '') || '/'
        : request.nextUrl.pathname;
      
      // Create destination URL with search params
      const url = new URL(`/tenants/${tenantId}${path}`, request.url);
      
      // Copy all search params
      request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      
      return NextResponse.rewrite(url);
    } catch (error) {
      console.error('Error in tenant middleware:', error);
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export default clerkMiddleware(async (auth, req) => {

  if (
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  return tenantMiddleware(req, auth);
});


export const config = {
  matcher: [
    '/((?!_next|sign-in|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|_next|static|favicon.ico).*)',
  ],
};