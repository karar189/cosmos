/**
 * Email template utilities for Submit Data functionality
 */

/**
 * Get the email template text for project data submission
 * @param translations - Translation object with greeting, message, and closing (already interpolated by i18n)
 * @returns Formatted email template string
 */
export function getEmailTemplate(
  translations: {
    greeting: string;
    message: string;
    closing: string;
  }
): string {
  return `${translations.greeting}
${translations.message}
${translations.closing}`;
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Open email client with pre-filled content
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param body - Email body text
 */
export function openEmailClient(
  to: string,
  subject: string = '',
  body: string = ''
): void {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

