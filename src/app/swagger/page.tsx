// const SwaggerPage = dynamic(() => import("./SwaggerPage"), {
//   // ssr: false, // SSR 비활성화 (swagger-ui는 브라우저에서만 동작)
// });

// src/app/swagger/SwaggerPage.tsx (혹은 page.tsx)
"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

export function SwaggerPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js";
    script.onload = () => {
      //  @ts-ignore
      window.SwaggerUIBundle({
        url: "/api/docs", // 👈 이게 위의 route.ts에서 만든 API 문서
        dom_id: "#swagger-ui",
      });
    };
    ref.current?.appendChild(script);
  }, []);

  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      <div id="swagger-ui" ref={ref} />
    </div>
  );
}

export default function Page() {
  return <SwaggerPage />;
}
