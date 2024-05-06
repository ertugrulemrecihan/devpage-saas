'use client';

import { useParams } from 'next/navigation';

const PublicUserPage = () => {
  const { username } = useParams();

  return (
    <div>
      <h1>User: {username}</h1>
    </div>
  );
};

export default PublicUserPage;
