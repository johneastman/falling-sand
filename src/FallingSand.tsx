import { useRef, useEffect } from "react";
import "./FallingSand.css";

interface FallingSandProps {
    canvasWidth: number;
    canvasHeight: number;
    cellSize: number;
}

export default function FallingSand(props: FallingSandProps) {
    const { canvasWidth, canvasHeight, cellSize } = props;

    const gridWidth: number = Math.floor(canvasWidth / cellSize);
    const gridHeight: number = Math.floor(canvasHeight / cellSize);

    const isMouseDown = useRef<boolean>(false);
    const gridRef = useRef<number[]>(new Array(gridWidth * gridHeight).fill(0));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const context = useRef<CanvasRenderingContext2D>();

    useEffect(() => {
        const canvas = canvasRef.current!;
        context.current = canvas.getContext("2d")!;

        // Function to draw a circle where the user clicks
        const placeCell = (event: MouseEvent) => {
            event.stopImmediatePropagation();

            if (!isMouseDown.current) return;

            console.log("Placing cell...");

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const gridX: number = Math.floor(x / cellSize);
            const gridY: number = Math.floor(y / cellSize);

            const newGrid = Array.from(gridRef.current);
            newGrid[gridY * gridWidth + gridX] = 1;
            gridRef.current = newGrid;
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

        let animationFrame: number;
        const main = () => {
            const grid: number[] = gridRef.current;

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

            animationFrame = requestAnimationFrame(main);
        };

        // Game Loop
        animationFrame = requestAnimationFrame(main);

        // Clean up function
        return () => {
            canvas.removeEventListener("mousemove", placeCell);
            canvas.removeEventListener("mousedown", setMouseDown);
            canvas.removeEventListener("mouseup", setMouseUp);

            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div id="canvas-container">
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
        </div>
    );
}
