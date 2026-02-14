import React from 'react';

interface StructuredDataProps {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    author: string;
    slug: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
    headline,
    description,
    image,
    datePublished,
    author,
    slug,
}) => {
    const baseUrl = 'https://dailyinstruct.com';
    const url = `${baseUrl}/articles/${slug}`;

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'NewsArticle',
                headline: headline,
                image: [image],
                datePublished: datePublished,
                dateModified: datePublished,
                description: description,
                author: {
                    '@type': 'Person',
                    name: author,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Daily Instruct',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${baseUrl}/logo.png`,
                    },
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': url,
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: baseUrl,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Articles',
                        item: `${baseUrl}/sitemap-page`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: headline,
                        item: url,
                    },
                ],
            },
            {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                url: baseUrl,
                name: 'Daily Instruct',
                description: 'Where Learning Meets Innovation',
                publisher: {
                    '@id': `${baseUrl}/#organization`,
                },
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default StructuredData;
