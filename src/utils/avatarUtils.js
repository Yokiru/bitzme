/**
 * Avatar Utility Functions
 */

/**
 * Get initials from name
 * @param {string} name - User's name
 * @returns {string} First letter of name
 */
export const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
};

/**
 * Generate consistent color from name hash
 * @param {string} name - User's name
 * @returns {string} HSL color string
 */
export const generateAvatarColor = (name) => {
    if (!name) return 'hsl(200, 50%, 50%)';

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate hue from hash (0-360)
    const hue = Math.abs(hash % 360);

    // Use consistent saturation and lightness for good visibility
    return `hsl(${hue}, 65%, 55%)`;
};

/**
 * Get avatar URL from user profile
 * @param {Object} user - User object
 * @returns {string|null} Avatar URL or null
 */
export const getAvatarUrl = (user) => {
    if (!user) return null;

    // Check profile avatar_url
    if (user.avatar_url) {
        return user.avatar_url;
    }

    // Check user metadata
    if (user.user_metadata?.avatar_url) {
        return user.user_metadata.avatar_url;
    }

    return null;
};
