/**
 * Utility to manage document title dynamically per page
 */

const BASE_TITLE = "CoBox";

/**
 * Sets the document title with the base title appended.
 * @param pageTitle - The specific page title
 * @example setPageTitle("Vehicles") -> "Vehicles | CoBox"
 */
export function setPageTitle(pageTitle: string): void {
  document.title = `${pageTitle} | ${BASE_TITLE}`;
}

/**
 * Resets the document title to the base title
 */
export function resetPageTitle(): void {
  document.title = `${BASE_TITLE} - Fleet Management and Logistics System`;
}
