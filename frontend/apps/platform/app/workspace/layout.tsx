import WorkspaceLayoutComponent from '@/components/layouts/WorkspaceLayout/WorkspaceLayout';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth bypassed for development - workspace pages are now accessible without authentication
  return <WorkspaceLayoutComponent>{children}</WorkspaceLayoutComponent>;
}
