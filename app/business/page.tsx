export const revalidate = 60;
import React from 'react';
import CategoryDashboard from '@/components/CategoryDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business & Market Analysis',
  description: 'In-depth analysis of global business moves, corporate strategy, and macroeconomic trends.',
};

export default function BusinessPage() {
  return (
    <CategoryDashboard 
      categoryName="business" 
      categoryTitle="Business" 
      categoryDescription="In-depth analysis of global business moves, corporate strategy, and macroeconomic trends." 
    />
  );
}