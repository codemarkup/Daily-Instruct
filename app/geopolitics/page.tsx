export const revalidate = 60;
import React from 'react';
import CategoryDashboard from '@/components/CategoryDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geopolitics & World Affairs',
  description: 'Expert analysis and situation trackers for ongoing geopolitical events and international relations.',
};

export default function GeopoliticsPage() {
  return (
    <CategoryDashboard 
      categoryName="geopolitics" 
      categoryTitle="Geopolitics" 
      categoryDescription="Expert analysis and situation trackers for ongoing geopolitical events and international relations." 
    />
  );
}
