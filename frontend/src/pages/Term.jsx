import './Term.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Term = () => {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div>
      <div className="term text-center pt-5 pb-5 text-white">
        <p><Link to="/" style={{color:'inherit',textDecoration:'none'}}>HOME</Link> - TERMS & CONDITIONS</p>
        <h1>Terms & Conditions</h1>
      </div>
      
      <div className="container-section pt-5 pb-5">
        <div className="term-content">
          <div className="term-intro mb-5">
            <p className="lead">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              Welcome to Jelwo Jewellery. These Terms and Conditions govern your use of our website and the purchase 
              of products from our online store. By accessing or using our website, you agree to be bound by these terms.
            </p>
            <p className="text-muted mt-3">
              <i className="fa-solid fa-info-circle me-2"></i>
              Click on any section below to view detailed information
            </p>
          </div>

          <div className="accordion" id="termAccordion">
            {/* Section 1 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 1 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(1)}
                >
                  <span className="section-number">1.</span> Acceptance of Terms
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 1 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  <ul>
                    <li>You must be at least 18 years old to make purchases on our website</li>
                    <li>You agree to provide accurate and complete information during registration and checkout</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You agree to notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 2 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(2)}
                >
                  <span className="section-number">2.</span> Products & Services
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 2 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>All products and services offered on our website are subject to availability:</p>
                  <ul>
                    <li><strong>Product Descriptions:</strong> We strive to provide accurate product descriptions, images, and specifications</li>
                    <li><strong>Pricing:</strong> All prices are listed in Indian Rupees (INR) and are subject to change without notice</li>
                    <li><strong>Availability:</strong> Products are subject to availability and we reserve the right to limit quantities</li>
                    <li><strong>Authenticity:</strong> All jewellery items are genuine and come with authenticity certificates where applicable</li>
                    <li><strong>Customization:</strong> Custom orders may take additional time and are non-refundable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 3 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(3)}
                >
                  <span className="section-number">3.</span> Orders & Payment
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 3 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <h3 className="mt-3">Order Processing</h3>
                  <ul>
                    <li>Orders are processed within 1-2 business days after payment confirmation</li>
                    <li>We reserve the right to refuse or cancel any order for any reason</li>
                    <li>Order confirmation will be sent to your registered email address</li>
                  </ul>

                  <h3 className="mt-4">Payment Methods</h3>
                  <ul>
                    <li>We accept credit cards, debit cards, UPI, net banking, and digital wallets</li>
                    <li>All payments are processed through secure payment gateways</li>
                    <li>Payment must be received in full before order dispatch</li>
                    <li>We do not store your payment card information on our servers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 4 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(4)}
                >
                  <span className="section-number">4.</span> Shipping & Delivery
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 4 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We offer shipping across India with the following terms:</p>
                  <ul>
                    <li><strong>Shipping Charges:</strong> Rs. 40 for orders below Rs. 500, FREE shipping for orders above Rs. 500</li>
                    <li><strong>Delivery Time:</strong> 5-7 business days for domestic orders</li>
                    <li><strong>Tracking:</strong> Tracking information will be provided once the order is shipped</li>
                    <li><strong>Address Accuracy:</strong> Please ensure your shipping address is correct; we are not responsible for delays due to incorrect addresses</li>
                    <li><strong>Delivery Attempts:</strong> If delivery fails after 3 attempts, the order will be returned to us</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 5 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(5)}
                >
                  <span className="section-number">5.</span> Returns & Refunds
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 5 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <h3 className="mt-3">Return Policy</h3>
                  <p>We have a 30-day return policy from the date of delivery:</p>
                  <ul>
                    <li>Items must be unused, unworn, and in original packaging with all tags attached</li>
                    <li>Customized or personalized items are non-returnable</li>
                    <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
                    <li>Contact our customer service to initiate a return</li>
                  </ul>

                  <h3 className="mt-4">Refund Process</h3>
                  <ul>
                    <li>Refunds will be processed within 7-10 business days after receiving the returned item</li>
                    <li>Refunds will be credited to the original payment method</li>
                    <li>Shipping charges are non-refundable unless the item is defective or damaged</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 6 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(6)}
                >
                  <span className="section-number">6.</span> Warranty & Care
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 6 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <h3 className="mt-3">Product Warranty</h3>
                  <ul>
                    <li>All jewellery items come with a 6-month manufacturing defect warranty</li>
                    <li>Warranty does not cover normal wear and tear, misuse, or accidental damage</li>
                    <li>Warranty claims must be accompanied by the original purchase receipt</li>
                  </ul>

                  <h3 className="mt-4">Care Instructions</h3>
                  <ul>
                    <li>Store jewellery in a cool, dry place away from direct sunlight</li>
                    <li>Avoid contact with perfumes, lotions, and harsh chemicals</li>
                    <li>Clean with a soft cloth; professional cleaning recommended for precious stones</li>
                    <li>Remove jewellery before swimming, bathing, or exercising</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 7 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(7)}
                >
                  <span className="section-number">7.</span> Intellectual Property
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 7 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>All content on this website is protected by intellectual property rights:</p>
                  <ul>
                    <li>All designs, images, text, graphics, and logos are owned by Jelwo Jewellery</li>
                    <li>You may not reproduce, distribute, or use any content without written permission</li>
                    <li>Product images are for representation purposes only</li>
                    <li>Unauthorized use of our intellectual property may result in legal action</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 8 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(8)}
                >
                  <span className="section-number">8.</span> User Conduct
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 8 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>When using our website, you agree not to:</p>
                  <ul>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Transmit any harmful or malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated systems to access the website without permission</li>
                    <li>Post false, misleading, or defamatory content in reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 9 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(9)}
                >
                  <span className="section-number">9.</span> Limitation of Liability
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 9 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>To the maximum extent permitted by law:</p>
                  <ul>
                    <li>We are not liable for any indirect, incidental, or consequential damages</li>
                    <li>Our total liability shall not exceed the amount paid for the product</li>
                    <li>We are not responsible for delays or failures due to circumstances beyond our control</li>
                    <li>We do not guarantee uninterrupted or error-free website operation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 10 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(10)}
                >
                  <span className="section-number">10.</span> Third-Party Links
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 10 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>Our website may contain links to third-party websites:</p>
                  <ul>
                    <li>We are not responsible for the content or practices of third-party websites</li>
                    <li>Links are provided for convenience only and do not imply endorsement</li>
                    <li>You access third-party websites at your own risk</li>
                    <li>Review the terms and privacy policies of any third-party sites you visit</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 11 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 11 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(11)}
                >
                  <span className="section-number">11.</span> Modifications to Terms
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 11 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We reserve the right to modify these terms at any time:</p>
                  <ul>
                    <li>Changes will be effective immediately upon posting on the website</li>
                    <li>The "Last Updated" date will reflect the most recent changes</li>
                    <li>Continued use of the website after changes constitutes acceptance</li>
                    <li>We recommend reviewing these terms periodically</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 12 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(12)}
                >
                  <span className="section-number">12.</span> Governing Law & Disputes
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 12 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>These terms are governed by the laws of India:</p>
                  <ul>
                    <li>Any disputes shall be subject to the exclusive jurisdiction of courts in Ahmedabad, Gujarat</li>
                    <li>We encourage resolving disputes through direct communication first</li>
                    <li>If resolution is not possible, formal legal proceedings may be initiated</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 13 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 13 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(13)}
                >
                  <span className="section-number">13.</span> Contact Information
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 13 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>For questions about these Terms & Conditions, please contact us:</p>
                  <div className="contact-info-box mt-4 p-4 bg-light rounded">
                    <h4 className="mb-3"><strong>Jelwo Jewellery</strong></h4>
                    <div className="contact-item mb-3">
                      <i className="fa-solid fa-location-dot me-3 text-danger"></i>
                      <span>720, Bodakdev, Ahmedabad, Gujarat, 380059, India</span>
                    </div>
                    <div className="contact-item mb-3">
                      <i className="fa-solid fa-envelope me-3 text-danger"></i>
                      <span>Email: <a href="mailto:jelwo1824@gmail.com">jelwo1824@gmail.com</a></span>
                    </div>
                    <div className="contact-item mb-3">
                      <i className="fa-solid fa-phone me-3 text-danger"></i>
                      <span>Phone: <a href="tel:+916355520913">+91-6355520913</a></span>
                    </div>
                    <div className="contact-item">
                      <i className="fa-solid fa-clock me-3 text-danger"></i>
                      <span>Business Hours: Monday - Saturday, 10:00 AM - 7:00 PM IST</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 border-start border-danger border-4 bg-light">
                    <p className="mb-0">
                      <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="term-footer mt-5 p-4 bg-light rounded">
            <h3 className="text-center mb-3">Agreement</h3>
            <p className="text-center mb-0">
              By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Term
