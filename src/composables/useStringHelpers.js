export default function useStringHelpers() {
  const getInitials = (fullName) => {
    if (!fullName) return '';

    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    const first = parts[0][0].toUpperCase();
    const last = parts[parts.length - 1][0].toUpperCase();

    return first + last;
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  return {
    getInitials,
    truncateText
  };
}
