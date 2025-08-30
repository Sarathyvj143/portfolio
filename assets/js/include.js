'use strict';
// Load a partial HTML file into a target element, then run a callback
window.loadPartial = async function (targetSelector, url, after) {
  console.log('loadPartial called with:', targetSelector, url);
  const host = document.querySelector(targetSelector);
  if (!host) {
    console.error('Target element not found:', targetSelector);
    return;
  }
  console.log('Target element found:', host);
  
  try {
    console.log('Fetching:', url);
    const res = await fetch(url, { cache: 'no-cache' });
    console.log('Fetch response status:', res.status);
    const html = await res.text();
    console.log('Loaded HTML length:', html.length);
    console.log('HTML content:', html);
    host.innerHTML = html;
    console.log('HTML inserted into target element');
    if (typeof after === 'function') {
      console.log('Calling after function');
      after();
    }
  } catch (e) {
    console.error('Failed to load', url, e);
  }
};
