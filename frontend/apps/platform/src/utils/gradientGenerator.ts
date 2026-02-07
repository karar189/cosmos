/**
 * Gradient Generator Utility
 * 
 * Generates deterministic gradient backgrounds for project avatars
 * when no image is available.
 */

/**
 * Generate a deterministic linear gradient based on project identifier
 * 
 * @param seed - Project ID or name to generate gradient from
 * @returns CSS linear-gradient string
 * 
 * @example
 * const gradient = generateProjectGradient('uniswap');
 * // Returns: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
 */
export function generateProjectGradient(seed: string): string {
  // Hash function to generate consistent number from string
  const hash = seed.split('').reduce((acc, char) => {
    const chr = char.charCodeAt(0);
    acc = (acc << 5) - acc + chr;
    return acc & acc; // Convert to 32-bit integer
  }, 0);

  // Gradient color pairs inspired by CORE3 design system
  const gradients = [
    { from: '#B6F0D1', to: '#96D1B5' }, // Mint (primary)
    { from: '#667eea', to: '#764ba2' }, // Purple
    { from: '#f093fb', to: '#f5576c' }, // Pink
    { from: '#4facfe', to: '#00f2fe' }, // Blue
    { from: '#43e97b', to: '#38f9d7' }, // Green
    { from: '#fa709a', to: '#fee140' }, // Orange-Pink
    { from: '#30cfd0', to: '#330867' }, // Teal-Purple
    { from: '#a8edea', to: '#fed6e3' }, // Pastel
    { from: '#ffecd2', to: '#fcb69f' }, // Peach
    { from: '#ff9a9e', to: '#fecfef' }, // Rose
  ];

  // Select gradient based on hash
  const index = Math.abs(hash) % gradients.length;
  const selected = gradients[index];

  return `linear-gradient(135deg, ${selected.from} 0%, ${selected.to} 100%)`;
}

