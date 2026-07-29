export const revalidate = 60;
import React from 'react';
import CategoryDashboard from '@/components/CategoryDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guides & Explainers',
  description: 'Evergreen explainers and deep-dives breaking down complex topics across tech, markets, and global affairs.',
};

export default function GuidesPage() {
  return (
    <CategoryDashboard 
      categoryName="guides" 
      categoryTitle="Guides" 
      categoryDescription="Evergreen explainers and deep-dives breaking down complex topics across tech, markets, and global affairs." 
    />
  );
}