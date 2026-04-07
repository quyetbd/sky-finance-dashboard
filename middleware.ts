export { default } from 'next-auth/middleware'

// Bảo vệ tất cả routes dưới /dashboard
// Unauthenticated → redirect tới /login (cấu hình trong authOptions.pages.signIn)
export const config = {
  matcher: ['/dashboard/:path*'],
}
