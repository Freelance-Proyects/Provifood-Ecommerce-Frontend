// Prefetch ligero - solo para la home
if (window.location.pathname === '/') {
  setTimeout(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/productos';
    document.head.appendChild(link);
  }, 2000);
}
