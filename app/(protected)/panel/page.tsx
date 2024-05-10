'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UsernameForm } from '@/app/(protected)/_components/panel/username-form';
import { UserPageDetails } from '@/app/(protected)/_components/panel/user-page-details';

const PanelPage = () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">📊 Panel</p>
      </CardHeader>
      <CardContent>
        <UsernameForm />
        <UserPageDetails />
      </CardContent>
    </Card>
  );
};

export default PanelPage;
