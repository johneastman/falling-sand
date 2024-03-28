import { Position } from "./types";

export default class Grid {
    width: number;
    height: number;
    cellSize: number;
    grid: number[];

    constructor(canvasWidth: number, canvasHeight: number, cellSize: number) {
        this.width = Math.floor(canvasWidth / cellSize);
        this.height = Math.floor(canvasHeight / cellSize);
        this.cellSize = cellSize;
        this.grid = new Array(this.width * this.height).fill(0);
    }

    clear() {
        this.grid = new Array(this.width * this.height).fill(0);
    }

    set(x: number, y: number, color: number): void {
        const gridX: number = Math.floor(x / this.cellSize);
        const gridY: number = Math.floor(y / this.cellSize);
        console.log(gridX, gridY);

        this.grid[gridY * this.width + gridX] = color;
    }

    setCircle(x: number, y: number, radius: number, color: number) {
        const gridX: number = Math.floor(x / this.cellSize);
        const gridY: number = Math.floor(y / this.cellSize);

        let newPoints: Position[] = [];
        for (let y2 = gridY - radius; y2 <= gridY + 1; y2++) {
            for (let x2 = gridX - 1; x2 <= gridX + radius; x2++) {
                const prob = Math.random();
                if (this.isOutOfBounds(x2, y2) || prob < 0.45) continue;
                newPoints.push({ x: x2, y: y2 });
            }
        }

        for (const point of newPoints) {
            const { x: newX, y: newY } = point;
            this.grid[newY * this.width + newX] = color;
        }
    }

    canvasPosition(index: number): [x: number, y: number] {
        const x: number = (index % this.width) * this.cellSize;
        const y: number = Math.floor(index / this.width) * this.cellSize;
        return [x, y];
    }

    // Allow us to swap two particles (or space)
    swap(a: number, b: number): void {
        const temp = this.grid[a];
        this.grid[a] = this.grid[b];
        this.grid[b] = temp;
    }

    isEmpty(index: number): boolean {
        return this.grid[index] === 0;
    }

    isOutOfBounds(x: number, y: number): boolean {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    updatePixel(index: number) {
        // Get the indices of the pixels directly below
        const below = index + this.width;
        const belowLeft = below - 1;
        const belowRight = below + 1;
        const column = index % this.width;

        // If there are no pixels below, including diagonals, move it accordingly.
        if (this.isEmpty(below)) {
            this.swap(index, below);
        } else if (this.isEmpty(belowLeft) && belowLeft % this.width < column) {
            this.swap(index, belowLeft);
        } else if (
            this.isEmpty(belowRight) &&
            belowRight % this.width > column
        ) {
            this.swap(index, belowRight);
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.grid.forEach((color, index) => {
            const [x, y] = this.canvasPosition(index);

            const cellColor: string = color === 0 ? "#ffffff" : "#dcb159";

            context.beginPath();
            context.rect(x, y, this.cellSize, this.cellSize);
            context.fillStyle = cellColor;
            context.strokeStyle = cellColor;
            context.fill();
            context.stroke();
        });
    }

    update() {
        // Go through each pixel one by one and apply the rule
        for (let index = this.grid.length - this.width - 1; index >= 0; index--)
            this.updatePixel(index);
    }
}
