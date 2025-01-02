import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { StudentLayout } from "../components/layouts/studentLayout";
import AdminLayout from "../components/layouts/adminLayout";
import { CheckAuthenticated } from "../Utils/auth/auth";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isHOD, setIsHOD] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const authenticated = CheckAuthenticated(token);

    setIsAuthenticated(authenticated);
    setIsHOD(router.pathname.startsWith("/admin"));

    if (!authenticated) {
      router.push("/");
    }
  }, [router.pathname, router]);

  const Layout = isHOD ? AdminLayout : StudentLayout;
  
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
