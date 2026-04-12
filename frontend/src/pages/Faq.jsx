import React from 'react'
import './Faq.css'
import {Link} from 'react-router-dom'
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const Faq = () => {
    const [open, setOpen] = useState(null);

  return (
    <div>
        <div className="page-title-section">
          <h1>FAQ'S</h1>
          <p><Link to="/">Home</Link> &gt; FAQ'S</p>
        </div>
        <div className="question container-section">
            <div className="row justify-content-center ">
              <div className="col-12 col-lg-3 border-end p-2 text-start p-5">
                 <div className='mb-5'>
                    <h5 className='text-danger '>MOST COMMON</h5>
                    <h2>Questions</h2>
                 </div>
                <ul className='list-unstyled faq-list'>
                    <li className='hvr-underline-from-center'>MY ACCOUNT</li><br />
                    <li className='hvr-underline-from-center'>COMPANY POLICIES</li><br />
                    <li className='hvr-underline-from-center'>PAYMENT OPTION</li><br />
                    <li className='hvr-underline-from-center'>TERM & CONDITIONS</li>
                </ul>
              </div>
              <div className="col-12 col-lg-9 pt-2 p-5 ">
                  <div>
                    <h2>Shopping Information</h2>
                  </div>
                <div className="collapse-button mt-5 ">
                    <div className='border-bottom pb-3 pt-3 '>
                        <div
                        onClick={() => setOpen(open === 0 ? null : 0)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>How CAN I CONNECT US</h6></div>
                      <div> <FontAwesomeIcon icon={open === 0 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 0}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 1 ? null : 1)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>DO YOU HAVE RESTOCK NOTIFICATION</h6></div>
                      <div> <FontAwesomeIcon icon={open === 1 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 1}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 2 ? null : 2)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW DO I CARE FOR MY ITEMS</h6></div>
                      <div> <FontAwesomeIcon icon={open === 2 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 2}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                     {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 3 ? null : 3)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW DO I KNOW WHAT SIZE I AM? </h6></div>
                      <div> <FontAwesomeIcon icon={open === 3 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 3}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 4 ? null : 4)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW DO I USE A GIFT CARD? </h6></div>
                      <div> <FontAwesomeIcon icon={open === 4 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 4}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                     {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 5 ? null : 5)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW OFTEN DO YPU RESTOCK ITEMS ? </h6></div>
                      <div> <FontAwesomeIcon icon={open === 5 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 5}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 6 ? null : 6)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>WHERE ARE YOUR PRODUCT MADE ? </h6></div>
                      <div> <FontAwesomeIcon icon={open === 6 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 6}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                </div>
                <div>
                    <h2 className='mt-5 mb-5'>Return and Exchange</h2>
                  </div>
                <div className="collapse-button  ">
                    <div className='border-bottom pb-3 pt-3 '>
                        <div
                        onClick={() => setOpen(open === 7 ? null : 7)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>CAN I RETURN OR EXCHANGE SOMETHING IN STORE</h6></div>
                      <div> <FontAwesomeIcon icon={open === 7 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 7}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 8 ? null : 8)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW DO I GET A SHIPPING LABEL</h6></div>
                      <div> <FontAwesomeIcon icon={open === 8 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 8}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 9 ? null : 9)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>WHAT I DO WHEN I GET A DIFFECTIVE ITEM?</h6></div>
                      <div> <FontAwesomeIcon icon={open === 9 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 9}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    
                </div>
                <div>
                    <h2 className='mt-5 mb-5'>Payment Information</h2>
                  </div>
                <div className="collapse-button mt-3 ">
                    <div className='border-bottom pb-3 pt-3 '>
                        <div
                        onClick={() => setOpen(open === 14 ? null : 14)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW MUCH IS SHIPPING AND HOW LONG WILL IT TAKE</h6></div>
                      <div> <FontAwesomeIcon icon={open === 14? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 14}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 15 ? null : 15)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>HOW LONG WILL IT TAKE TO GET MY PACKAGE ?</h6></div>
                      <div> <FontAwesomeIcon icon={open === 15 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 15}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                    {/*second collpase */}
                    <div className='border-bottom pb-3 pt-3'>
                        <div
                        onClick={() => setOpen(open === 16 ? null : 16)}
                        aria-controls="example-collapse-text1"
                        aria-expanded={open}
                        className='d-flex justify-content-between align-item-center  '
                    >
                      <div> <h6>BRAND IOS SIMPLY  A MORE EFFICIENT WAY TO STELL THINGS?</h6></div>
                      <div> <FontAwesomeIcon icon={open === 16 ? faMinus : faPlus}/></div>
                    </div>
                    <Collapse in={open === 16}>
                        <div id="example-collapse-text1">
                           We do have restock notifications! If a product is coming back in stock, simply click on the size ofthe product you're wanting to be notified of and a button should appear that says once somecome back in stock, it will send you an email to notify you
                        </div>
                    </Collapse>
                    </div>
                    {/*second collpase */}
                </div>
                  </div>
              </div>
            </div>
        </div>
   
  )
}

export default Faq
