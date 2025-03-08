"use client";

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-100 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Plant vs Interview. All rights reserved.
    </footer>
  );
}
