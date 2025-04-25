"use client";
import type { AppProps } from "next/app";
import Register from "./(auth)/register/page";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Register/>
    </div>
  );
}
