import { StoryPage } from '@/components/story-page';
import { STORY_PAGES } from '@/content/pages';
import { pageMetadata } from '@/lib/metadata';

const page = STORY_PAGES['hospitality'];

export const metadata = pageMetadata({ title: page.metaTitle, description: page.description, path: page.path });

export default function Page() {
  return <StoryPage page={page} />;
}
