import { useRef, useEffect } from "react";
import "./FallingSand.css";
import Grid from "./grid";

interface FallingSandProps {
    canvasWidth: number;
    canvasHeight: number;
    cellSize: number;
}

export default function FallingSand(props: FallingSandProps) {
    const { canvasWidth, canvasHeight, cellSize } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMouseDown = useRef<boolean>(false);
    const gridRef = useRef<Grid>(new Grid(canvasWidth, canvasHeight, cellSize));

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        // Function to draw a circle where the user clicks
        const placeCell = (event: MouseEvent) => {
            event.stopImmediatePropagation();

            if (!isMouseDown.current) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            gridRef.current.set(x, y, 1);
        };

        const setMouseDown = (_: MouseEvent) => {
            isMouseDown.current = true;
        };

        const setMouseUp = (_: MouseEvent) => {
            isMouseDown.current = false;
        };

        // Add the event listener
        canvas.addEventListener("mousemove", placeCell);
        canvas.addEventListener("mousedown", setMouseDown);
        canvas.addEventListener("mouseup", setMouseUp);

        let animationFrame: number;
        const main = () => {
            const canvasContext = context;
            if (canvasContext === undefined) return;

            // Draw
            gridRef.current.grid.forEach((color, index) => {
                if (color === 0) return;

                const [x, y] = gridRef.current.canvasPosition(index);

                canvasContext.beginPath();
                canvasContext.rect(x, y, cellSize, cellSize);
                canvasContext.fillStyle = "black";
                canvasContext.fill();
                canvasContext.stroke();
            });

            // Update
            gridRef.current.update();

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
