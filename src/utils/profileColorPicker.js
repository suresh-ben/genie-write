const profileColors = [
    "#BF3131",
    "#015551",
    "#27391C",
    "#4D55CC",
    "#504B38",
    "#690B22",
    "#2C3930",
    "#2D336B",
];

export const getProfileColor = (identifier) => {
    if(!identifier) return "#808080"; //grey

    let sum = 0;

    // Generate a hash value from the identifier
    for (let i = 0; i < identifier?.length; i++) {
        sum += identifier.charCodeAt(i);
    }

    // Get a consistent index within the profileColors array
    const index = sum % profileColors.length;
    
    return profileColors[index];
}