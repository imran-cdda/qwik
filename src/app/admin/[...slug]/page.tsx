import QwikEngine from '@qwik/engine';

export default function AdminPage({ params }: { params: Promise<{ slug: string[] }> }) {
  return <QwikEngine params={params} />;
}
