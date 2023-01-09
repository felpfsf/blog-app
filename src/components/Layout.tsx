import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  classNames?: string;
}

function Layout({ children, classNames }: Props) {
  return (
    <div className={`m-auto max-w-7xl ${classNames || "default"}`}>
      {children}
    </div>
  );
}

export default Layout;
