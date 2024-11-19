"use client";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur drop-shadow">
      <div className="container flex h-14 items-center justify-between m-auto">
        <Link href={"/"} className="font-bold lg:inline-block">
          Quill
        </Link>
      </div>
    </header>
  );
};
