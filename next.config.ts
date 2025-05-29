import type { NextConfig } from "next";

/*
  Next.js 설정 파일
  -> styled-components를 사용할 때는 compiler 옵션을 설정해야
     SSR 환경에서도 올바르게 스타일을 렌더링할 수 있다.
*/
const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true, // styled-components용 SSR 최적화 활성화
  },
};

export default nextConfig;
