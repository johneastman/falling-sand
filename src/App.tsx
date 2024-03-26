import { useRef, useState, useEffect } from "react";
import "./App.css";

export default function App() {
    const width = 800;
    const height = 500;
    const cellSize = 10;

    const gridWidth: number = Math.floor(width / cellSize);
    const gridHeight: number = Math.floor(height / cellSize);

    const [grid, setGrid] = useState<number[]>(
        new Array(gridWidth * gridHeight).fill(0)
    );
    const isMouseDown = useRef<boolean>(false);
    const gridRef = useRef<number[]>(grid);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const context = useRef<CanvasRenderingContext2D>();

    useEffect(() => {
        gridRef.current = grid;

        const canvasContext = context.current;
        if (canvasContext === undefined) return;

        // Draw
        grid.forEach((color, index) => {
            if (color === 0) return;

            const x: number = (index % gridWidth) * cellSize;
            const y: number = Math.floor(index / gridWidth) * cellSize;

            canvasContext.beginPath();
            canvasContext.rect(x, y, cellSize, cellSize);
            canvasContext.fillStyle = "black";
            canvasContext.fill();
            canvasContext.stroke();
        });

        // Update
    }, [grid]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        context.current = canvas.getContext("2d")!;

        // Function to draw a circle where the user clicks
        const placeCell = (event: MouseEvent) => {
            event.stopImmediatePropagation();

            if (!isMouseDown.current) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const gridX: number = Math.floor(x / cellSize);
            const gridY: number = Math.floor(y / cellSize);

            const newGrid = Array.from(gridRef.current);
            newGrid[gridY * gridWidth + gridX] = 1;
            setGrid(newGrid);
        };

        const setMouseDown = (_: MouseEvent) => {
            isMouseDown.current = true;
        };

        const setMouseUp = (_: MouseEvent) => {
            isMouseDown.current = false;
        };

        // Add the event listener
        canvas.addEventListener("mousedown", setMouseDown);
        canvas.addEventListener("mouseup", setMouseUp);
        canvas.addEventListener("mousemove", placeCell);

        // Clean up function
        return () => {
            canvas.removeEventListener("mousemove", placeCell);
            canvas.removeEventListener("mousedown", setMouseDown);
            canvas.removeEventListener("mouseup", setMouseUp);
        };
    }, []);

    return (
        <div id="canvas-container">
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    );
}
