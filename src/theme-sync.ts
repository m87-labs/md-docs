// Client module to sync theme from URL parameter
// This runs on initial page load to apply theme passed from the main site

if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get('theme');

  if (themeParam === 'light' || themeParam === 'dark') {
    // Store the theme preference in localStorage (Docusaurus uses 'theme' key)
    localStorage.setItem('theme', themeParam);

    // Apply the theme immediately to avoid flash
    document.documentElement.setAttribute('data-theme', themeParam);

    // Strip the theme param from the URL
    params.delete('theme');
    const newSearch = params.toString();
    const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }
}

export {};
