import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/:domain(.+)']);

async function tenantMiddleware(request: NextRequest, auth: any) {
  const hostname = request.headers.get('host') || '';
  
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.next();
  }
  
  const currentHost = hostname.split(':')[0];
  const domainParts = currentHost.split('.');
  
  const isVercelPreview = hostname.includes('forgewealth.app');
  const isLocalhost = hostname.includes('localhost');
  let tenantId: string | null = null;
  
  if (isVercelPreview) {
    tenantId = domainParts[0];
  } else if (isLocalhost) {
    const pathSegments = request.nextUrl.pathname.split('/');
    tenantId = pathSegments[1] || null;
    
    if (pathSegments.length <= 1) {
      return NextResponse.next();
    }
  } else {
    if (domainParts.length >= 3) {
      tenantId = domainParts[0];
    }
  }

  if (tenantId && tenantId !== 'www') {
    try {
      const clerk = await clerkClient();
      const { orgId } = await auth();
      
      if (!orgId) {
        return new NextResponse(
          JSON.stringify({ error: 'No organization ID found. Please authenticate.' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const org = await clerk.organizations.getOrganization({ organizationId: orgId });

      const hasAccess = org.name === tenantId;
      if (!hasAccess) {
        return new NextResponse(
          JSON.stringify({ error: `Access denied: You don't have permission to access tenant '${tenantId}'` }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const path = isLocalhost 
        ? request.nextUrl.pathname.replace(`/${tenantId}`, '') || '/'
        : request.nextUrl.pathname;
      
      const url = new URL(`/tenants/${tenantId}${path}`, request.url);
      request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      
      return NextResponse.rewrite(url);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'An error occurred in tenant middleware',
          details: error instanceof Error ? error.message : String(error)
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  return NextResponse.next();
}

export default clerkMiddleware(async (auth, req) => {
  try {
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
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'An error occurred in middleware',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

export const config = {
  matcher: [
    '/((?!_next|sign-in|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|_next|static|favicon.ico).*)',
  ],
};