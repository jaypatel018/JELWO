import React from 'react'
import './ReadMore.css'
import { Link } from 'react-router-dom'
const ReadMore = () => {
  return (
    <div>
        <div className="page-title-section">
          <h1>NEWS</h1>
          <p><Link to="/">Home</Link> &gt; NEWS</p>
        </div>
        <div className="container-section " >
              <div className="row">
                      <div className="col-12 col-lg-3 rm-col order-2 order-lg-1 ">
                        <div className="read-left ">
                            <div className="input">
                                <input type="text" placeholder="Search"/>
                                <div className="search"><i className="fa-solid fa-magnifying-glass"></i></div>
                            </div>
                            <div className="recent">
                                <h6 className="mt-3 mb-3 fs-4">Recent posts</h6>
                                <div className=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3">
                                    <div className="w-50 "><img className="w-100 read1 " src="img/read1.avif" alt=""/></div>
                                    <div>
                                        <span className="text-secondary">MAR 10.2025</span>
                                        <h6 className="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>
                                <div className=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3">
                                    <div className="w-50 "><img className="w-100 read1 " src="img/read2.avif" alt=""/></div>
                                    <div>
                                        <span className="text-secondary">MAR 10.2025</span>
                                        <h6 className="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>
                                <div className=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3 ">
                                    <div className="w-50 "><img className="w-100 read1 " src="img/read3.avif" alt=""/></div>
                                    <div>
                                        <span className="text-secondary">MAR 10.2025</span>
                                        <h6 className="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>  
                            </div>
                            <div className="tag">
                                <h3 className="mt-2 ">Tags</h3>
                                <ul className="list-unstyled order-list1 d-flex gap-1 flex-wrap ">
                                    <li>ACCESSORIES</li>
                                    <li>BLOG</li>
                                    <li>CLOTHING</li>
                                    <li>FASHION</li>
                                    <li>HANDMADE</li>
                                </ul>
                            </div>
                            <div><h3 className="mt-3 mb-3">Newslatter</h3></div>
                            <div className="input">
                                <input type="text" placeholder="Enter your email"/>
                                <div className="search"><i className="fa-regular fa-envelope"></i></div>
                            </div>
                            <div className="insat-card pt-4 pb-2">
                                <div className="insta-card">
                                    <div><img className="w-100" src="img/insta1.avif" alt=""/></div>
                                    <div><img className="w-100" src="img/insta2.avif" alt=""/></div>
                                    <div><img className="w-100" src="img/insta3.avif" alt=""/></div>
                                    <div><img className="w-100" src="img/insta4.jpg" alt=""/></div>
                                    <div><img className="w-100" src="img/insta5.avif" alt=""/></div>
                                    <div><img className="w-100" src="img/insta6.avif" alt=""/></div>
                                </div>
                            </div>
                        </div>
                      </div> 
                      <div className=" col-12 col-lg-9 rm-col order-1 order-lg-2">
                        <div>
                            <div className="jelwo-img">
                              <img className="w-100 jel" src="img/jelwobanner.webp" alt=""/>
                            </div>
                            <div className="mt-4 mb-4">
                                <span className="fs-4">Mar 02, 2025 / By Andrew johns / 1 comment</span>
                                <h1 className="mt-3 mb-3">Crafted for the moments that matter.</h1>
                                <span>As part of our mission create space for women to express their sensuality without shame fear or the patriarchal gaze we’re asking women to invite us into their most intimate space. Fashion you can buy, but style you possess. The key to style is learning who you are, which takes years. There's no how-to road map to style.</span><br/><br/>
                                <span>Style is the only thing you can’t buy. It’s not in a shopping bag, a label, or a price tag. It’s something reflected from our soul to the outside world - an emotion. I thank you for the recognition of the brilliance.</span>
                            </div>
                            <div className="d-flex gap-4 article mt-5 mb-5">
                                <div className="article-img"><img className="w-100 art-img" src="img/artical-des2.webp" alt=""/></div>
                                <div className="article-img"><img className="w-100 art-img" src="img/articledesk2.jpg" alt=""/></div>
                            </div>
                            <div>
                                <h2 className="mt-2 mb-2"><i>I thank you for the recognition of the brilliance. It’s something reflecte from our soul to the outside world - an emotion</i></h2><br/><br/>
                                <span>Fashion is what you’re offered four times a year by designers. And style is what you choose. I think there is beauty in everything. What ‘normal’ people would perceive as ugly, I can usually see something of beauty in it. Shoes transform your body language and attitude. They lift you physically and emotionally.</span>
                                <div>
                                 <div className="tag mt-4 mb-4">
                                    <ul className="list-unstyled order-list1 d-flex gap-4 flex-wrap ">
                                     <li>ACCESSORIES</li>
                                     <li>BLOG</li>
                                     <li>CLOTHING</li>
                                     <li>FASHION</li>
                                     <li>HANDMADE</li>
                                   </ul>
                                 </div>
                               </div>
                            </div>
                            <form action="" className="border-top">
                                <h4 className="mt-3 mb-3">Leave a comment</h4>
                                <div className="name mt-2 mb-2">
                                    <label for="name">Name*</label>
                                    <input type="text" placeholder="Name"/>
                                </div>
                                <div className="name mt-2 mb-2">
                                    <label for="name">Email address*</label>
                                    <input type="text" placeholder="Email address"/>
                                </div>
                                 <div className="name mt-2 mb-2">
                                    <label for="name">Message*</label><br/>
                                   <textarea rows="4">Message</textarea>
                                </div>
                                <div>
                                    <button className="post" type="submit">POST COMMENT</button>
                                </div>
                            </form>
                        </div>
                      </div> 
              </div>
        </div>
    </div>
  )
}

export default ReadMore
