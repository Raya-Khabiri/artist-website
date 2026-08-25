import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}