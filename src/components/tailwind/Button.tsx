// components/styled/Button.tsx
"use client";

import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "outline";
};

const StyledButton = styled.button<{ variant: "default" | "outline" }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "outline"
      ? `
        background: white;
        color: #2563eb;
        border: 1px solid #2563eb;

        &:hover {
          background: #eff6ff;
        }
      `
      : `
        background: #2563eb;
        color: white;
        border: none;

        &:hover {
          background: #1d4ed8;
        }
      `}
`;

export const Button = ({ children, variant = "default" }: Props) => {
  return <StyledButton variant={variant}>{children}</StyledButton>;
};
