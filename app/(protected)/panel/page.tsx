'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UsernameForm } from '@/app/(protected)/_components/panel/username-form';

const PanelPage = () => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">📊 Panel</p>
      </CardHeader>
      <CardContent>
        <p className="text-center text-lg text-muted-foreground">
          Welcome to the panel! 🎉
        </p>
        <UsernameForm />
      </CardContent>
    </Card>
  );
};

export default PanelPage;
