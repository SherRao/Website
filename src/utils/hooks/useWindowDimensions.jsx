import React from "react";

const useWindowDimensions = () => {
    const [dimensions, setDimensions] = React.useState(getDimensions());
    const getDimensions = () => ( {width: window.innerWidth, height: window.innerHeight} );
    const handleResize = () => { setDimensions(getDimensions()); };

    React.useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return [...dimensions];
};

export { useWindowDimensions };
