export const revalidate = 60;
import React from 'react';
import CategoryDashboard from '@/components/CategoryDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets & Financial News',
  description: 'Live updates and analysis on the stock market, crypto, and financial indicators.',
};

export default function MarketPage() {
  return (
    <CategoryDashboard 
      categoryName="markets" 
      categoryTitle="Markets" 
      categoryDescription="Live updates and analysis on the stock market, crypto, and financial indicators." 
    />
  );
}