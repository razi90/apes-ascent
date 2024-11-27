export const commonButtonStyle = {
    size: "md", // Slightly larger for better visibility
    minW: "100px", // A wider minimum width for a modern look
    color: "primary.300", // Default text color
    borderRadius: "md", // Smooth rounded edges
    bg: "back.700", // Subtle background color matching the dark theme
    border: "1px solid", // Add a border for better separation
    borderColor: "primary.300", // Neutral gray border
    boxShadow: "0 0 3px 0px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
    fontWeight: "bold", // Bold text for emphasis
    _hover: {
        color: "primary.300", // Text color turns green on hover
        bg: "back.600", // Darker background for hover
        textDecoration: "none", // Prevent underline
        borderColor: "primary.300", // Border highlights in green
        boxShadow: "0 0 5px 0px rgba(40, 167, 69, 0.5)", // Green glow effect
        transform: "scale(1.05)", // Subtle scaling effect on hover
        transition: "all 0.2s ease-in-out", // Smooth transition
    },
    _active: {
        bg: "primary.300", // Active background turns green
        color: "back.800", // Text becomes dark for contrast
        boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.3)", // Inset shadow for press effect
        transform: "scale(0.98)", // Slight shrinking effect on press
    },
    _disabled: {
        bg: "gray.700", // Gray background for disabled state
        color: "gray.500", // Muted text color
        cursor: "not-allowed", // Indicate the button is non-clickable
        boxShadow: "none", // Remove shadow for disabled state
    },
};
