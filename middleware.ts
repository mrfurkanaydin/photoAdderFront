import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/customer/signin"
    // signIn2: "/uploads/signin"
  }
});

export const config = {
  matcher: ["/customer/album", "/customer/album/:path*"]
};
// export const config = { matcher: ['/customer/:path*', "/uploads/:path*"] };
