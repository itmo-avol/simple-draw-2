import { Point } from './point.js';

/**
 * Объект сцены рисования
 */
export class Stage
{
	/**
	 * Элемент холста рисования
	 * @type {HTMLCanvasElement}
	 */
	canvas;
	/**
	 * Контекст рисования
	 * @type {CanvasRenderingContext2D}
	 */
	context;
	
	/**
	 * Сцена обновлена и требует перерисовки?
	 * @type {boolean}
	 */
	#updated = true;
	/**
	 * Требуется обновление кэша (обновилось изображение)?
	 * @type {boolean}
	 */
	#cacheUpdated = false;
	/**
	 * Ширина холста в пикселах
	 * @type {number}
	 */
	#width;
	/**
	 * Высота холста в пикселах
	 * @type {number}
	 */
	#height;
	/**
	 * Кэш всего изображения на холсте
	 * @type {ImageData | null}
	 */
	#imageCache = null;
	/**
	 * Обработчик перерисовки части изображения
	 * @type {() => void}
	 */
	onDraw;
	/**
	 * Обработчик рисования после кэширования
	 * @type {() => void}
	 */
	onDrawAfterCache;
	
	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	constructor( canvas )
	{
		this.canvas = canvas;
		
		const context = canvas.getContext( '2d' );
		
		if ( !context )
		{
			throw new Error( 'Can\'t get 2D context' );
		}
		
		this.context = context;
		
		this.#width = canvas.width;
		this.#height = canvas.height;
		
		this.onDraw = () => {};
		this.onDrawAfterCache = () => {};
		
		this.#frameTick();
	}
	
	/**
	 * Ширина холста в пикселах
	 */
	get width()
	{
		return this.#width;
	}
	
	/**
	 * Ширина холста в пикселах
	 * @param {number} value
	 */
	set width( value )
	{
		this.#width = value;
		this.canvas.width = value;
	}
	
	/**
	 * Ширина холста в пикселах
	 */
	get height()
	{
		return this.#height;
	}
	
	/**
	 * Ширина холста в пикселах
	 * @param {number} value
	 */
	set height( value )
	{
		this.#height = value;
		this.canvas.height = value;
	}
	
	/**
	 * Перевести координаты в окне в точку на холсте
	 * @param {number} x
	 * @param {number} y
	 */
	toLocalPoint( x, y )
	{
		const rect = this.canvas.getBoundingClientRect();
		
		return new Point(
			x - rect.left,
			y - rect.top,
		);
	}
	
	/**
	 * Отмечает необходимость перерисовки
	 */
	shouldUpdate()
	{
		this.#updated = true;
	}
	
	/**
	 * Отмечает необходимость обновления кэша изображения
	 */
	shouldUpdateCache()
	{
		this.#cacheUpdated = true;
	}
	
	/**
	 * Проверяет, обновлён ли кэш изображения
	 */
	isCacheUpdated()
	{
		return this.#cacheUpdated;
	}
	
	/**
	 * Обновляет изображение на холсте
	 */
	update()
	{
		this.#draw();
	}
	
	/**
	 * Обрабатывает новый кадр
	 */
	#frameTick()
	{
		if ( !this.canvas || !this.canvas.parentElement )
		{
			return;
		}
		
		if (
			this.#updated
			|| this.#cacheUpdated
		)
		{
			this.#draw();
		}
		
		window.requestAnimationFrame( () => this.#frameTick() );
	}
	
	/**
	 * Рисует данные на холсте
	 */
	#draw()
	{
		this.#updated = false;
		
		if ( this.#imageCache )
		{
			this.context.putImageData( this.#imageCache, 0, 0 );
		}
		else
		{
			this.context.clearRect( 0, 0, this.width, this.height );
		}
		
		this.onDraw();
		
		if ( this.#cacheUpdated )
		{
			this.#cacheUpdated = false;
			this.#imageCache = this.context.getImageData(
				0,
				0,
				this.width,
				this.height,
			);
		}
		
		this.onDrawAfterCache();
	}
}
