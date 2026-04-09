/**
 * Wraps a view render function with an error boundary.
 * If the render throws, displays a clean fallback UI instead of a blank screen.
 */
export function withErrorBoundary(renderFn) {
  return async function (container) {
    try {
      await renderFn(container)
    } catch (err) {
      console.error('[Apex Focus] View render failed:', err)
      container.innerHTML = `
        <div class="error-boundary">
          <div class="error-boundary-inner">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="error-title">Something went wrong</p>
            <p class="error-msg">${err?.message || 'An unexpected error occurred.'}</p>
            <button class="btn-ghost" onclick="location.reload()">Reload app</button>
          </div>
        </div>
      `
    }
  }
}
