import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>MyAffiliateStore</strong>
          <p>Daily finds, better deals, easier decisions.</p>
        </div>

        <div className="footer-socials" aria-label="Social links">
          <a
            href="https://instagram.com/your-handle"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>
          <a
            href="https://youtube.com/your-channel"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube aria-hidden="true" />
          </a>
          <a
            href="https://facebook.com/your-page"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook aria-hidden="true" />
          </a>
        </div>

        <small>© 2026 MyAffiliateStore. All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer
