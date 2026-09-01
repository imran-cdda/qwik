import QwikEngine from '@qwik/engine';

export default async function AdminPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const currentPath = `/admin/${(resolvedParams.slug || []).join('/')}`;

  return <QwikEngine params={resolvedParams} currentPath={currentPath} />;
}
