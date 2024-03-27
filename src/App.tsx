import "./App.css";
import FallingSand from "./FallingSand";

export default function App() {
    const width = 800;
    const height = 500;
    const cellSize = 10;

    return (
        <FallingSand
            canvasWidth={width}
            canvasHeight={height}
            cellSize={cellSize}
        />
    );
}
