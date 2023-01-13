export type AboutPageProps = {
  id?: string;
  title: string;
  description: string;
  skills: string[];
  userId: string;
  avatarURL?: string | null;
  avatarALT?: string | null;
};

export type AboutPageWithID = AboutPageProps & { id: string };
