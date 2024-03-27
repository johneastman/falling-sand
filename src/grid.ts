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
        // this.grid[5] = 1;
    }

    clear() {
        this.grid = new Array(this.width * this.height).fill(0);
    }

    set(x: number, y: number, color: number): void {
        const gridX: number = Math.floor(x / this.cellSize);
        const gridY: number = Math.floor(y / this.cellSize);

        this.grid[gridY * this.width + gridX] = color;
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

    updatePixel(index: number) {
        // Get the indices of the pixels directly below
        const below = index + this.width;
        const belowLeft = below - 1;
        const belowRight = below + 1;

        // If there are no pixels below, including diagonals, move it accordingly.
        if (this.isEmpty(below)) {
            this.swap(index, below);
        } else if (this.isEmpty(belowLeft)) {
            this.swap(index, belowLeft);
        } else if (this.isEmpty(belowRight)) {
            this.swap(index, belowRight);
        }
    }

    update() {
        // Go through each pixel one by one and apply the rule
        for (let i = this.grid.length - this.width - 1; i > 0; i--) {
            this.updatePixel(i);
        }
    }
}
