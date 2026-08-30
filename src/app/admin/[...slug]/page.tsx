import QwikEngine from '@qwik/engine';
import Navigation from '@/components/navigation';

export default function AdminPage({ params }: { params: Promise<{ slug: string[] }> }) {
  return <QwikEngine params={params} navigation={<Navigation />} />;
}
