/* script.js
   - Subtle matrix background
   - Smooth scroll for nav
   - Fade-in sections
   - Cookie banner simple handling
   - Contact form (mailto fallback)
   - Export PDF using html2pdf (client-side)
   - Privacy modal
*/

/* -----------------------
   UTIL: DOM Ready
   ----------------------- */
   document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initFadeIn();
    initCookieBanner();
    initContactForm();
    initPDFExport();
    initPrivacyModal();
    document.getElementById('year').textContent = new Date().getFullYear();
  });
  
  /* -----------------------
     MATRIX BACKGROUND (subtle)
     ----------------------- */
  function initMatrix(){
    const canvas = document.getElementById('matrixCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; cols = Math.floor(canvas.width / fontSize); drops = Array(cols).fill(1); }
    window.addEventListener('resize', resize);
  
    const fontSize = 14;
    let cols = 0;
    let drops = [];
  
    resize();
  
    const chars = "01";
    ctx.fillStyle = '#000';
    function draw(){
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#0ef1ff';
      ctx.font = fontSize + 'px monospace';
      for(let i=0;i<drops.length;i++){
        const text = chars.charAt(Math.floor(Math.random()*chars.length));
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);
        if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i]=0;
        drops[i]++;
      }
    }
    setInterval(draw, 55);
  }
  
  /* -----------------------
     SMOOTH SCROLL NAV
     ----------------------- */
  function initSmoothScroll(){
    document.querySelectorAll('a[data-scroll]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }
  
  /* -----------------------
     FADE IN ON SCROLL
     ----------------------- */
  function initFadeIn(){
    const options = {threshold:0.12};
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, options);
  
    document.querySelectorAll('.section-card, .project-card, .timeline-item, .hero-inner').forEach(el => {
      el.classList.add('fade');
      observer.observe(el);
    });
  }
  
  /* -----------------------
     COOKIE BANNER (simple)
     ----------------------- */
  function initCookieBanner(){
    const key = 'mp_cookie_v1';
    const banner = document.getElementById('cookieBanner');
    if(!banner) return;
    const accepted = localStorage.getItem(key);
    if(!accepted) banner.hidden = false;
    document.getElementById('cookieAccept').addEventListener('click', () => {
      localStorage.setItem(key, 'accepted'); banner.hidden = true;
    });
    document.getElementById('cookieReject').addEventListener('click', () => {
      localStorage.setItem(key, 'rejected'); banner.hidden = true;
    });
  }
  
  /* -----------------------
     CONTACT FORM (mailto fallback)
     ----------------------- */
  function initContactForm(){
    window.resetContact = function(){
      document.getElementById('contactForm').reset();
      document.getElementById('formNotice').textContent = '';
    };
  
    window.handleContact = function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const consent = document.getElementById('consent').checked;
      const notice = document.getElementById('formNotice');
  
      if(!name || !email || !message || !consent){
        notice.textContent = 'Merci de remplir tous les champs et d\'accepter la politique.';
        return false;
      }
  
      // Par défaut : ouverture du client mail (RGPD-friendly, pas de stockage)
      const subject = encodeURIComponent('Contact portfolio — ' + name);
      const body = encodeURIComponent(message + "\n\n--\n" + name + "\n" + email);
      window.location.href = `mailto:pierremaxence16@gmail.com?subject=${subject}&body=${body}`;
      notice.textContent = 'Ton client mail s\'ouvre pour envoyer le message.';
      return false;
    };
  }
  
  /* -----------------------
     PDF EXPORT (html2pdf)
     ----------------------- */
  function initPDFExport(){
    const btn = document.getElementById('exportPdf');
    if(!btn) return;
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Génération PDF…';
      // Clone page content and prepare for PDF (remove canvas & modals)
      const clone = document.getElementById('page').cloneNode(true);
      // Remove interactive elements that don't translate well to PDF
      clone.querySelectorAll('canvas, .btn, form, details, #cookieBanner, #privacyModal').forEach(n => n.remove());
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.style.padding = '20px';
      wrapper.style.background = '#fff';
      wrapper.style.color = '#111';
      wrapper.appendChild(clone);
  
      const opt = {
        margin:       10,
        filename:     'Portfolio_Maxence_Pierre.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      try {
        await html2pdf().set(opt).from(wrapper).save();
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la génération du PDF.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Exporter en PDF';
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
  
    const exportBtn = document.getElementById("exportPdf");
    exportBtn.addEventListener("click", () => {
      const element = document.getElementById("page");
  
      const opt = {
        margin:       [10, 10, 10, 10], // haut, droite, bas, gauche
        filename:     'Portfolio_Maxence_Pierre.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      html2pdf().set(opt).from(element).save();
    });
  });
  
  
  /* -----------------------
     PRIVACY MODAL
     ----------------------- */
  function initPrivacyModal(){
    const modal = document.getElementById('privacyModal');
    const open = document.getElementById('openPrivacy');
    const close = document.getElementById('closePrivacy');
    if(open){
      open.addEventListener('click', (e) => { e.preventDefault(); modal.style.display='grid'; modal.setAttribute('aria-hidden','false'); });
    }
    if(close){
      close.addEventListener('click', () => { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
    }
    // Close modal on backdrop click
    if(modal){
      modal.addEventListener('click', (e) => { if(e.target === modal){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }});
    }
  }
  