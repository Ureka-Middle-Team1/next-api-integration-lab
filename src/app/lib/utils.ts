// lib/utils.ts

/**
 * className을 조건부로 조합해주는 유틸리티 함수
 * falsy한 값(undefined/null/false)은 제거됨
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
