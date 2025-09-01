# Blog System Documentation

This document explains how to use the blog system that has been added to your React portfolio template.

## Overview

The blog system consists of two main pages:
1. **Blog List Page** - Shows all blog previews with images and descriptions
2. **Blog Post Page** - Displays the full blog content with a table of contents

## File Structure

```
public/data/sections/blog.json          # Blog section configuration
public/data/blog-posts/                 # Individual blog post data
├── getting-started-with-react.json
├── modern-css-techniques.json
└── javascript-performance-tips.json

src/components/articles/Blog.jsx        # Main blog component (handles routing)
src/components/articles/BlogList.jsx    # Blog list display
src/components/blog/BlogCard.jsx        # Individual blog card
src/components/blogpost/BlogPost.jsx    # Blog post display
src/components/blogpost/TableOfContents.jsx # Table of contents
```

## How It Works

### 1. Blog Section Configuration

The blog section is configured in `public/data/sections/blog.json` and follows the same structure as other sections:

```json
{
    "title": {
        "locales": {
            "en": {
                "title_short": "Blog",
                "title_short_nav": "Blog",
                "title_long_prefix": "Read my",
                "title_long": "{{Blog}} Posts"
            }
        }
    },
    "articles": [
        {
            "id": 1,
            "component": "Blog",
            "locales": {
                "en": {
                    "description": "Read my latest thoughts, tutorials, and insights"
                }
            },
            "blogs": [
                // Blog entries go here
            ]
        }
    ]
}
```

### 2. Blog Entries

Each blog entry in the `blogs` array should have:

```json
{
    "id": "unique-blog-id",
    "title": {
        "en": "Blog Title"
    },
    "description": {
        "en": "Short description of the blog post"
    },
    "image": "/images/pictures/blog-image.jpg",
    "date": "2024-01-15",
    "readTime": "8 min read",
    "tags": ["Tag1", "Tag2", "Tag3"]
}
```

### 3. Blog Post Content

Individual blog posts are stored in `public/data/blog-posts/` as separate JSON files:

```json
{
    "id": "unique-blog-id",
    "title": { "en": "Blog Title" },
    "description": { "en": "Description" },
    "image": "/images/pictures/blog-image.jpg",
    "date": "2024-01-15",
    "readTime": "8 min read",
    "author": "Your Name",
    "tags": ["Tag1", "Tag2"],
    "content": {
        "en": {
            "sections": [
                {
                    "id": "section-id",
                    "title": "Section Title",
                    "content": "Section content goes here..."
                }
            ]
        }
    }
}
```

## Adding New Blog Posts

### Step 1: Add Blog Entry
Add a new entry to the `blogs` array in `public/data/sections/blog.json`.

### Step 2: Create Blog Post Data
Create a new JSON file in `public/data/blog-posts/` with the same `id` as the blog entry.

### Step 3: Add Images
Place your blog images in `public/images/pictures/` and reference them in the blog data.

## Features

### Blog List Page
- Responsive grid layout
- Blog cards with images, titles, descriptions, dates, and tags
- Hover effects and smooth transitions
- Click to navigate to full blog post

### Blog Post Page
- Full blog content display
- Sticky table of contents
- Responsive design
- Back navigation to blog list
- URL-based routing (supports browser back/forward)

### Table of Contents
- Automatically generated from blog sections
- Sticky positioning on desktop
- Smooth scrolling to sections
- Active section highlighting

## Styling

The blog system uses SCSS files for styling:
- `Blog.scss` - Main blog section styles
- `BlogList.scss` - Blog list layout and header
- `BlogCard.scss` - Individual blog card styles
- `BlogPost.scss` - Blog post page styles
- `TableOfContents.scss` - Table of contents styles

All styles use CSS custom properties (variables) for consistent theming.

## Navigation

The blog system integrates with the existing navigation system:
- Blog section appears in the "Showcase" category
- Uses the existing section routing
- Maintains browser history for blog posts
- Supports deep linking to specific blog posts

## Customization

### Colors and Themes
Modify the SCSS files to change colors, fonts, and layouts. The system uses CSS custom properties for easy theming.

### Layout
Adjust grid layouts, spacing, and responsive breakpoints in the SCSS files.

### Content Structure
Modify the JSON structure to add new fields or change the content organization.

## Troubleshooting

### Blog Posts Not Loading
- Check that the blog post JSON files exist in `public/data/blog-posts/`
- Verify that the `id` in the blog entry matches the filename
- Check browser console for any fetch errors

### Images Not Displaying
- Ensure image paths are correct
- Check that images exist in the specified directories
- Verify image file permissions

### Styling Issues
- Check that all SCSS files are properly imported
- Verify CSS custom properties are defined in your theme
- Check for CSS conflicts with existing styles

## Future Enhancements

Potential improvements for the blog system:
- Search functionality
- Category filtering
- Pagination for large numbers of blog posts
- Social sharing buttons
- Comment system
- Related posts
- RSS feed generation
- SEO optimization
- Markdown support for blog content
