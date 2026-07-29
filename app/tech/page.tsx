export const revalidate = 60;
import React from 'react';
import CategoryDashboard from '@/components/CategoryDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology & Latest Tech Trends',
  description: 'Stay updated with the latest technology news, AI developments, software updates, and tech innovations.',
};

export default function TechPage() {
  return (
    <CategoryDashboard 
      categoryName="tech" 
      categoryTitle="Technology" 
      categoryDescription="Stay updated with the latest technology news, AI developments, software updates, and tech innovations." 
    />
  );
}