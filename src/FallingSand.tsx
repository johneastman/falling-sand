import { useRef, useEffect } from "react";
import "./FallingSand.css";
import Grid from "./grid";
import { Position } from "./types";

interface FallingSandProps {
    canvasWidth: number;
    canvasHeight: number;
    cellSize: number;
}

export default function FallingSand(props: FallingSandProps) {
    const { canvasWidth, canvasHeight, cellSize } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gridRef = useRef<Grid>(new Grid(canvasWidth, canvasHeight, cellSize));
    const repeat = useRef<number>();
    const currentMousePosition = useRef<Position>({ x: 0, y: 0 });

    const mouseEventFactory = (
        canvas: HTMLCanvasElement,
        action: (position: Position) => void
    ) => {
        return (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            action({ x: x, y: y });
        };
    };

    const startSand = (position: Position) => {
        currentMousePosition.current = position;
        repeat.current = setInterval(() => placeCell(), 50);
    };

    const stopSand = (_: Position) => {
        clearInterval(repeat.current);
        repeat.current = undefined;
    };

    /**
     * Get the current position of the mouse and place a grain of sand
     * at that position.
     */
    const placeCell = () => {
        const { x, y } = currentMousePosition.current;
        gridRef.current.setCircle(x, y, 2, 1);
    };

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        const mouseDown = mouseEventFactory(canvas, startSand);
        const mouseUp = mouseEventFactory(canvas, stopSand);
        const mouseLeave = mouseEventFactory(canvas, stopSand);

        /**
         * When the mouse moves, change where sand is dropped without
         * stopping the flow of sand.
         */
        const mouseMove = mouseEventFactory(
            canvas,
            (position: Position) => (currentMousePosition.current = position)
        );

        // Add the event listeners
        canvas.addEventListener("mousemove", mouseMove);
        canvas.addEventListener("mousedown", mouseDown);
        canvas.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("mouseleave", mouseLeave);

        let animationFrame: number;
        const main = () => {
            // Draw
            gridRef.current.draw(context);

            // Update
            gridRef.current.update();

            // Next Frame
            animationFrame = requestAnimationFrame(main);
        };

        // Start game Loop
        animationFrame = requestAnimationFrame(main);

        // Clean up function
        return () => {
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mousedown", mouseDown);
            canvas.removeEventListener("mouseup", mouseUp);
            canvas.removeEventListener("mouseleave", mouseLeave);

            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <>
            <div id="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                />
                <div>
                    <button onClick={() => gridRef.current.clear()}>
                        Clear
                    </button>
                </div>
            </div>
        </>
    );
}
