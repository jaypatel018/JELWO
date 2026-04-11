import React from 'react'
import { Link } from 'react-router-dom'
import './Blog.css'

const blogs = [
  {
    img: 'img/blog-1.webp',
    date: '10 MAR 2025',
    author: 'Priya Sharma',
    tag: 'Gold Care',
    title: 'How to Keep Your Gold Jewelry Shining Forever',
    excerpt: 'Gold jewelry loses its luster over time due to sweat, oils, and dust. Learn the best home remedies and professional tips to restore that brilliant shine without damaging the metal.',
  },
  {
    img: 'img/blog2.webp',
    date: '18 MAR 2025',
    author: 'Ananya Mehta',
    tag: 'Trends',
    title: 'Top Jewelry Trends to Watch in 2025',
    excerpt: 'From layered necklaces to bold statement rings, 2025 is all about self-expression. Discover the hottest jewelry trends that are dominating runways and street style this year.',
  },
  {
    img: 'img/blog3.webp',
    date: '25 MAR 2025',
    author: 'Riya Patel',
    tag: 'Bridal',
    title: 'The Ultimate Bridal Jewelry Guide for Indian Weddings',
    excerpt: 'Choosing the right jewelry for your wedding day can be overwhelming. This guide breaks down every piece — from maang tikka to payal — and how to match them with your lehenga.',
  },
  {
    img: 'img/blog4.webp',
    date: '02 APR 2025',
    author: 'Kavya Nair',
    tag: 'Buying Guide',
    title: 'Rose Gold vs White Gold vs Yellow Gold — Which to Choose?',
    excerpt: 'Each gold variant has its own charm and suits different skin tones. We break down the differences in color, durability, and price so you can make the perfect choice for your next piece.',
  },
  {
    img: 'img/blog5.webp',
    date: '10 APR 2025',
    author: 'Sneha Joshi',
    tag: 'Gifting',
    title: '5 Jewelry Pieces That Make the Perfect Gift for Every Occasion',
    excerpt: 'Whether it\'s a birthday, anniversary, or just because — jewelry is always a thoughtful gift. Here are five timeless pieces that will make anyone feel truly special.',
  },
  {
    img: 'img/blog7.webp',
    date: '18 APR 2025',
    author: 'Meera Iyer',
    tag: 'Sustainability',
    title: 'Why Ethical and Sustainable Jewelry Matters More Than Ever',
    excerpt: 'The jewelry industry has a significant environmental footprint. Learn how to identify ethically sourced pieces and why choosing sustainable jewelry is a powerful statement.',
  },
  {
    img: 'img/blog8.webp',
    date: '26 APR 2025',
    author: 'Divya Reddy',
    tag: 'Styling',
    title: 'How to Layer Necklaces Like a Pro',
    excerpt: 'Layering necklaces is an art. Mix lengths, textures, and metals to create a look that\'s uniquely yours. Our styling guide walks you through the dos and don\'ts of necklace stacking.',
  },
  {
    img: 'img/blog9.webp',
    date: '05 MAY 2025',
    author: 'Pooja Verma',
    tag: 'History',
    title: 'The Rich History of Indian Gold Jewelry Through the Ages',
    excerpt: 'Indian gold jewelry dates back thousands of years, each era leaving its own distinct mark. From Mughal filigree to temple jewelry of the South, explore the fascinating heritage of Indian adornment.',
  },
]

const Blog = () => {
  return (
    <div>
      <div className="blog-banner">
        <div className="text-center text-white">
          <p><Link to="/" style={{color:'inherit',textDecoration:'none'}}>HOME</Link> — NEWS</p>
          <h1>Our Blog</h1>
        </div>
      </div>

      <div className="container-section pt-5 pb-5">
        <div className="grid-card">
          {blogs.map((blog, i) => (
            <div className="blog-card p-2" key={i}>
              <div className="blog-img">
                <div className="blog-hvr">
                  <Link to="/readmore"><i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <img className="w-100" src={blog.img} alt={blog.title} />
              </div>
              <div className="blog-content pt-3">
                <div className="blog-meta">
                  <span className="blog-tag">{blog.tag}</span>
                  <span className="blog-date">{blog.date} &nbsp;|&nbsp; By {blog.author}</span>
                </div>
                <h5 className="blog-title">{blog.title}</h5>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <Link to="/readmore" className="read-more1">Read More <i className="fa-solid fa-arrow-right ms-1"></i></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
