export default function JudgingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is nested within (main)/layout.tsx, which now handles showing the correct header.
  // We just need to return the children to avoid creating a duplicate structure.
  return <>{children}</>;
}
