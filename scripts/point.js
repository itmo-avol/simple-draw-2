// @ts-check

/**
 * Класс точек двухмерной плоскости
 */
export class Point
{
	/** @type {number} */
	x;
	/** @type {number} */
	y;
	
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor( x, y )
	{
		this.x = x;
		this.y = y;
	}
	
	/**
	 * @param {Point} other
	 */
	isEqual( other )
	{
		return (
			( this.x === other.x )
			&& ( this.y === other.y )
		);
	}
}

/**
 * Рассчитать среднюю точку между двумя
 * 
 * @param {Point} point1 Первая точка
 * @param {Point} point2 Вторая точка
 */
export function calcMiddlePoint( point1, point2 )
{
	return new Point(
		point1.x + (point2.x - point1.x) / 2,
		point1.y + (point2.y - point1.y) / 2
	);
}
