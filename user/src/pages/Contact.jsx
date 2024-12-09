import React from "react";
import "./style/Contact.css";

const Contact = () => {
  return (
    <>
      {" "}
      <div className="contact-container">
       
        <div className="contact-info">
          <div className="info-box">
            <i className="fas fa-phone-alt contact-icon"></i>
            <h3>Call To Us</h3>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone:+01567-222-222</p>
            <hr />
          </div>

          <div className="info-box">
            <i className="fas fa-envelope contact-icon"></i>
            <h3>Write To Us</h3>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: customer@ShopEase.com</p>
            <p>Emails: support@ShopEase.com</p>
          </div>
        </div>

     
        <div className="contact-form">
          <div>
            <input type="text" name="name" placeholder="Your Name *" required />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone *"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
