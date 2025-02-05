import layoutsMap from "@/components/layouts/layoutMap";
import "../styles/globals.css";
import { CheckAuthenticated } from "@/utils/auth/auth";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { StudentProvider } from "@/utils/auth/Context/StudentProvider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Ensure router is ready before running navigation logic
    if (router.isReady) {
      const token = sessionStorage.getItem("token");
      if (token == null) {
        router.replace("/");
      } else {
        const authenticated = CheckAuthenticated(token);

        if (!authenticated) {
          router.replace("/");
        }
      }
    }
  }, [router.isReady]);

  // Determine if the current route is in the layoutsMap
  const Layout =
    layoutsMap[router.pathname.split("/")[1]] ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>);
  const isStudentLayout = router.pathname.startsWith("/student"); // Adjust based on your needs

  return (
    <>
      {isStudentLayout ? (
        <StudentProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StudentProvider>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
