"use client";

import React, { useEffect, useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * 이 컴포넌트는 styled-components의 SSR(Server Side Rendering)을 지원하기 위해 사용됩니다.
 * 서버에서 스타일을 수집하여 HTML에 주입하고, 클라이언트에서는 일반적인 렌더링을 합니다.
 */
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // 서버에서 사용할 스타일시트 객체 생성
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  // 서버에 HTML이 삽입되기 직전, 스타일을 수집하여 삽입
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    return <>{styles}</>;
  });

  useEffect(() => {
    // clean-up(정리) 함수에서 sheet.seal() 호출을 통해, 스타일 시트를 안전하게 종료함
    return () => {
      styledComponentsStyleSheet.seal();
    };
  }, []);

  // 클라이언트에서는 스타일시트 없이 children만 렌더링
  if (typeof window !== "undefined") return <>{children}</>;

  // 서버에서 StyleSheetManager로 스타일 주입
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>
  );
}
