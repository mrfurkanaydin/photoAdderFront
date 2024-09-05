import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/customer/signin"
    // signIn2: "/uploads/signin"
  }
});

export const config = { matcher: [] };
// export const config = { matcher: ['/customer/:path*', "/uploads/:path*"] };
