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

    set(x: number, y: number, color: number) {
        const gridX: number = Math.floor(x / this.cellSize);
        const gridY: number = Math.floor(y / this.cellSize);

        this.grid[gridY * this.width + gridX] = color;
    }

    canvasPosition(index: number): [x: number, y: number] {
        const x: number = (index % this.width) * this.cellSize;
        const y: number = Math.floor(index / this.width) * this.cellSize;
        return [x, y];
    }
}
