import './Privacy.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div>
      <div className="page-title-section">
        <h1>PRIVACY POLICY</h1>
        <p><Link to="/">Home</Link> &gt; PRIVACY POLICY</p>
      </div>
      
      <div className="container-section pt-5 pb-5">
        <div className="privacy-content">
          <div className="privacy-intro mb-5">
            <p className="lead">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              At Jelwo, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or make a purchase from us.
            </p>
            <p className="text-muted mt-3">
              <i className="fa-solid fa-info-circle me-2"></i>
              Click on any section below to view detailed information
            </p>
          </div>

          <div className="accordion" id="privacyAccordion">
            {/* Section 1 */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${openSection !== 1 ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => toggleSection(1)}
                >
                  <span className="section-number">1.</span> Information We Collect
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 1 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <h3 className="mt-3">Personal Information</h3>
                  <p>When you make a purchase or create an account, we collect:</p>
                  <ul>
                    <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                    <li><strong>Billing Information:</strong> Billing address, payment card details</li>
                    <li><strong>Shipping Information:</strong> Delivery address, shipping preferences</li>
                    <li><strong>Account Information:</strong> Username, password, order history</li>
                  </ul>

                  <h3 className="mt-4">Device & Usage Information</h3>
                  <p>We automatically collect certain information when you visit our site:</p>
                  <ul>
                    <li><strong>Device Data:</strong> IP address, browser type, operating system</li>
                    <li><strong>Usage Data:</strong> Pages viewed, time spent, click patterns</li>
                    <li><strong>Location Data:</strong> General geographic location based on IP</li>
                    <li><strong>Cookies:</strong> Session data, preferences, shopping cart contents</li>
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
                  <span className="section-number">2.</span> How We Use Your Information
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 2 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We use the collected information for the following purposes:</p>
                  <ul>
                    <li><strong>Order Processing:</strong> To fulfill and deliver your orders</li>
                    <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer support</li>
                    <li><strong>Account Management:</strong> To maintain your account and provide personalized services</li>
                    <li><strong>Marketing:</strong> To send promotional emails (with your consent)</li>
                    <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent transactions</li>
                    <li><strong>Website Improvement:</strong> To analyze and improve our website performance</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
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
                  <span className="section-number">3.</span> Information Sharing
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 3 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We do not sell your personal information. We may share your data with:</p>
                  <ul>
                    <li><strong>Service Providers:</strong> Payment processors, shipping companies, email services</li>
                    <li><strong>Business Partners:</strong> Analytics providers, marketing platforms (anonymized data)</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
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
                  <span className="section-number">4.</span> Data Security
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 4 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We implement industry-standard security measures to protect your information:</p>
                  <ul>
                    <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
                    <li><strong>Secure Storage:</strong> Encrypted databases and secure servers</li>
                    <li><strong>Access Controls:</strong> Limited employee access to personal data</li>
                    <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                    <li><strong>PCI Compliance:</strong> Payment Card Industry Data Security Standards</li>
                  </ul>
                  <p className="mt-3">
                    <em>Note: While we strive to protect your data, no method of transmission over the internet 
                    is 100% secure. We cannot guarantee absolute security.</em>
                  </p>
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
                  <span className="section-number">5.</span> Cookies & Tracking
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 5 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We use cookies and similar technologies to enhance your experience:</p>
                  
                  <h3 className="mt-4">Essential Cookies</h3>
                  <p>Required for website functionality:</p>
                  <div className="table-responsive">
                    <table className="table table-bordered border-secondary mt-3">
                      <thead>
                        <tr>
                          <th className="p-3">Cookie Name</th>
                          <th className="p-3">Purpose</th>
                          <th className="p-3">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>session_id</td>
                          <td>Maintains user session</td>
                          <td>Session</td>
                        </tr>
                        <tr>
                          <td>cart_token</td>
                          <td>Stores shopping cart items</td>
                          <td>14 days</td>
                        </tr>
                        <tr>
                          <td>auth_token</td>
                          <td>User authentication</td>
                          <td>30 days</td>
                        </tr>
                        <tr>
                          <td>csrf_token</td>
                          <td>Security protection</td>
                          <td>Session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="mt-4">Analytics Cookies</h3>
                  <p>Help us understand how visitors use our site:</p>
                  <div className="table-responsive">
                    <table className="table table-bordered border-secondary mt-3">
                      <thead>
                        <tr>
                          <th className="p-3">Cookie Name</th>
                          <th className="p-3">Purpose</th>
                          <th className="p-3">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>_ga</td>
                          <td>Google Analytics tracking</td>
                          <td>2 years</td>
                        </tr>
                        <tr>
                          <td>_gid</td>
                          <td>Google Analytics identifier</td>
                          <td>24 hours</td>
                        </tr>
                        <tr>
                          <td>_fbp</td>
                          <td>Facebook Pixel tracking</td>
                          <td>90 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-3">
                    You can control cookies through your browser settings. Note that disabling cookies 
                    may affect website functionality.
                  </p>
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
                  <span className="section-number">6.</span> Data Retention
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 6 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>We retain your personal information for as long as necessary to:</p>
                  <ul>
                    <li>Fulfill the purposes outlined in this policy</li>
                    <li>Comply with legal obligations (tax, accounting records)</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Maintain business records (typically 7 years for financial data)</li>
                  </ul>
                  <p className="mt-3">
                    After the retention period, we securely delete or anonymize your data.
                  </p>
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
                  <span className="section-number">7.</span> Your Rights
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 7 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <h3 className="mt-3">GDPR Rights (EU Residents)</h3>
                  <p>If you are located in the European Economic Area, you have the right to:</p>
                  <ul>
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Restriction:</strong> Limit how we use your data</li>
                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                    <li><strong>Object:</strong> Object to processing of your data</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                  </ul>

                  <h3 className="mt-4">CCPA Rights (California Residents)</h3>
                  <p>California residents have the right to:</p>
                  <ul>
                    <li>Know what personal information is collected</li>
                    <li>Know whether personal information is sold or disclosed</li>
                    <li>Opt-out of the sale of personal information</li>
                    <li>Request deletion of personal information</li>
                    <li>Non-discrimination for exercising CCPA rights</li>
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
                  <span className="section-number">8.</span> Third-Party Links
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 8 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>
                    Our website may contain links to third-party websites. We are not responsible for 
                    the privacy practices of these external sites. We encourage you to review their 
                    privacy policies before providing any personal information.
                  </p>
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
                  <span className="section-number">9.</span> Children's Privacy
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 9 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>
                    Our services are not directed to individuals under 18 years of age. We do not 
                    knowingly collect personal information from children. If you believe we have 
                    collected information from a child, please contact us immediately.
                  </p>
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
                  <span className="section-number">10.</span> International Transfers
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 10 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data in accordance with 
                    this Privacy Policy and applicable laws.
                  </p>
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
                  <span className="section-number">11.</span> Changes to This Policy
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 11 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices 
                    or legal requirements. We will notify you of significant changes by:
                  </p>
                  <ul>
                    <li>Posting the updated policy on our website</li>
                    <li>Updating the "Last Updated" date</li>
                    <li>Sending email notifications for material changes</li>
                  </ul>
                  <p className="mt-3">
                    Your continued use of our services after changes constitutes acceptance of the updated policy.
                  </p>
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
                  <span className="section-number">12.</span> Contact Us
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === 12 ? 'show' : ''}`}>
                <div className="accordion-body">
                  <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
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
                      <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="privacy-footer mt-5 p-4 bg-light rounded">
            <h3 className="text-center mb-3">Your Privacy Matters</h3>
            <p className="text-center mb-0">
              We are committed to transparency and protecting your personal information. 
              If you have any concerns or questions, please don't hesitate to reach out to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
