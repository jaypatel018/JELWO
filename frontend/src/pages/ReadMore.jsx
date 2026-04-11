import React from 'react'
import './ReadMore.css'
import { Link } from 'react-router-dom'
const ReadMore = () => {
  return (
    <div>
        <div class="container-section read-more pt-4 pb-4">
             <div class="text-center text-white">
                <div><p><Link to="/" style={{color:'inherit',textDecoration:'none'}}>HOME</Link>-NEWS</p></div>
                <div><h1>News</h1></div>
             </div>
        </div>
        <div class="container-section " >
              <div class="row p-3">
                      <div class="col-12 col-lg-3 p-3 order-2 order-lg-1 ">
                        <div class="read-left ">
                            <div class="input">
                                <input type="text" placeholder="Search"/>
                                <div class="search"><i class="fa-solid fa-magnifying-glass"></i></div>
                            </div>
                            <div class="recent">
                                <h6 class="mt-3 mb-3 fs-4">Recent posts</h6>
                                <div class=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3">
                                    <div class="w-50 "><img class="w-100 read1 " src="img/read1.avif" alt=""/></div>
                                    <div>
                                        <span class="text-secondary">MAR 10.2025</span>
                                        <h6 class="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>
                                <div class=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3">
                                    <div class="w-50 "><img class="w-100 read1 " src="img/read2.avif" alt=""/></div>
                                    <div>
                                        <span class="text-secondary">MAR 10.2025</span>
                                        <h6 class="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>
                                <div class=" d-flex justify-content-center align-items-center gap-3  pt-3 pb-3 ">
                                    <div class="w-50 "><img class="w-100 read1 " src="img/read3.avif" alt=""/></div>
                                    <div>
                                        <span class="text-secondary">MAR 10.2025</span>
                                        <h6 class="fs-5 mt-3">jewels as unique as your journey</h6>
                                    </div>
                                </div>  
                            </div>
                            <div class="tag">
                                <h3 class="mt-2 ">Tags</h3>
                                <ul class="list-unstyled order-list1 d-flex gap-1 flex-wrap ">
                                    <li>ACCESSORIES</li>
                                    <li>BLOG</li>
                                    <li>CLOTHING</li>
                                    <li>FASHION</li>
                                    <li>HANDMADE</li>
                                </ul>
                            </div>
                            <div><h3 class="mt-3 mb-3">Newslatter</h3></div>
                            <div class="input">
                                <input type="text" placeholder="Enter your email"/>
                                <div class="search"><i class="fa-regular fa-envelope"></i></div>
                            </div>
                            <div class="insat-card pt-4 pb-2">
                                <div class="insta-card">
                                    <div><img class="w-100" src="img/insta1.avif" alt=""/></div>
                                    <div><img class="w-100" src="img/insta2.avif" alt=""/></div>
                                    <div><img class="w-100" src="img/insta3.avif" alt=""/></div>
                                    <div><img class="w-100" src="img/insta4.jpg" alt=""/></div>
                                    <div><img class="w-100" src="img/insta5.avif" alt=""/></div>
                                    <div><img class="w-100" src="img/insta6.avif" alt=""/></div>
                                </div>
                            </div>
                        </div>
                      </div> 
                      <div class=" col-12 col-lg-9 p-3 order-1 order-lg-2">
                        <div>
                            <div class="jelwo-img">
                              <img class="w-100 jel" src="img/jelwobanner.webp" alt=""/>
                            </div>
                            <div class="mt-4 mb-4">
                                <span class="fs-4">Mar 02, 2025 / By Andrew johns / 1 comment</span>
                                <h1 class="mt-3 mb-3">Crafted for the moments that matter.</h1>
                                <span>As part of our mission create space for women to express their sensuality without shame fear or the patriarchal gaze we’re asking women to invite us into their most intimate space. Fashion you can buy, but style you possess. The key to style is learning who you are, which takes years. There's no how-to road map to style.</span><br/><br/>
                                <span>Style is the only thing you can’t buy. It’s not in a shopping bag, a label, or a price tag. It’s something reflected from our soul to the outside world - an emotion. I thank you for the recognition of the brilliance.</span>
                            </div>
                            <div class="d-flex gap-4 article mt-5 mb-5">
                                <div class="article-img"><img class="w-100 art-img" src="img/artical-des2.webp" alt=""/></div>
                                <div class="article-img"><img class="w-100 art-img" src="img/articledesk2.jpg" alt=""/></div>
                            </div>
                            <div>
                                <h2 class="mt-2 mb-2"><i>I thank you for the recognition of the brilliance. It’s something reflecte from our soul to the outside world - an emotion</i></h2><br/><br/>
                                <span>Fashion is what you’re offered four times a year by designers. And style is what you choose. I think there is beauty in everything. What ‘normal’ people would perceive as ugly, I can usually see something of beauty in it. Shoes transform your body language and attitude. They lift you physically and emotionally.</span>
                                <div>
                                 <div class="tag mt-4 mb-4">
                                    <ul class="list-unstyled order-list1 d-flex gap-4 flex-wrap ">
                                     <li>ACCESSORIES</li>
                                     <li>BLOG</li>
                                     <li>CLOTHING</li>
                                     <li>FASHION</li>
                                     <li>HANDMADE</li>
                                   </ul>
                                 </div>
                               </div>
                            </div>
                            <form action="" class="border-top">
                                <h4 class="mt-3 mb-3">Leave a comment</h4>
                                <div class="name mt-2 mb-2">
                                    <label for="name">Name*</label>
                                    <input type="text" placeholder="Name"/>
                                </div>
                                <div class="name mt-2 mb-2">
                                    <label for="name">Email address*</label>
                                    <input type="text" placeholder="Email address"/>
                                </div>
                                 <div class="name mt-2 mb-2">
                                    <label for="name">Message*</label><br/>
                                   <textarea rows="4">Message</textarea>
                                </div>
                                <div>
                                    <button class="post" type="submit">POST COMMENT</button>
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
