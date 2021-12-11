import { Point, calcMiddlePoint } from './point.js';

/**
 * @typedef {import('./stage').Stage} Stage
 */

/**
 * @typedef {import('./tools').Tools} Tools
 */

/**
 * Угол полной окружности
 */
export const PI2 = Math.PI * 2;

/**
 * Рисование на холсте
 */
export class Draw
{
	/**
	 * Сцена для рисования
	 * @type {Stage}
	 */
	#stage;
	/**
	 * Панель инструментов
	 * @type {Tools}
	 */
	#tools;
	/**
	 * Позиция курсора
	 * @type {Point}
	 */
	#cursor;
	/**
	 * Координаты рисуемой линии
	 * @type {Point[]}
	 */
	#linePoints = [];
	/**
	 * В процессе сохранения?
	 */
	#saving = false;
	/**
	 * Находимся в процессе рисования?
	 */
	#drawing = false;
	/**
	 * Контроллер прерывания работы класса
	 * @type {AbortController}
	 */
	#commonAbortController;
	/**
	 * @type {( event: MouseEvent ) => void}
	 */
	#handleMouseMoveBound;
	/**
	 * @type {( event: MouseEvent ) => void}
	 */
	#handleMouseDownBound;
	/**
	 * @type {( event: MouseEvent ) => void}
	 */
	#handleMouseUpBound;
	
	/**
	 * @param {Stage} stage
	 * @param {Tools} tools
	 */
	constructor( stage, tools )
	{
		this.#stage = stage;
		this.#tools = tools;
		
		this.#cursor = new Point( 0, 0 );
		this.#commonAbortController = new AbortController();
		
		this.#stage.onDrawAfterCache = () =>
		{
			this.#drawCursor();
		};
		this.#stage.onDraw = () =>
		{
			this.#draw();
		};
		
		this.#handleMouseMoveBound = this.#handleMouseMove.bind( this );
		this.#handleMouseDownBound = this.#handleMouseDown.bind( this );
		this.#handleMouseUpBound = this.#handleMouseUp.bind( this );
		
		this.#registerStageHandlers();
	}
	
	/**
	 * Очищает данные класса
	 */
	destroy()
	{
		this.#commonAbortController.abort();
	}
	
	/**
	 * Обрабатывает перемещение курсора по холсту
	 * @param {MouseEvent} event
	 */
	#handleMouseMove( event )
	{
		this.#cursor = this.#stage.toLocalPoint( event.clientX, event.clientY );
		this.#stage.shouldUpdate();
		
		if ( this.#drawing )
		{
			this.#linePoints.push( this.#cursor );
		}
	}
	
	/**
	 * Обрабатывает нажатие кнопки мыши
	 */
	#handleMouseDown()
	{
		this.#drawing = true;
		this.#linePoints.push( this.#cursor );
		
		document.addEventListener(
			'mouseup',
			this.#handleMouseUpBound,
			{
				signal: this.#commonAbortController.signal,
			},
		);
	}
	
	/**
	 * Обрабатывает отпускание кнопки мыши
	 */
	#handleMouseUp()
	{
		this.#drawing = false;
		this.#linePoints.push( this.#cursor );
		
		this.#stage.shouldUpdateCache();
		
		document.removeEventListener(
			'mouseup',
			this.#handleMouseUpBound,
		);
	}
	
	/**
	 * Регистрирует обработчики событий на сцене
	 */
	#registerStageHandlers()
	{
		document.addEventListener(
			'mousemove',
			this.#handleMouseMoveBound,
			{
				signal: this.#commonAbortController.signal,
			},
		);
		
		this.#stage.canvas.addEventListener(
			'mousedown',
			this.#handleMouseDownBound,
			{
				signal: this.#commonAbortController.signal,
			},
		);
	}
	
	/**
	 * Рисует курсор
	 */
	#drawCursor()
	{
		if ( this.#saving )
		{
			return;
		}
		
		const context = this.#stage.context;
		
		context.save();
		context.strokeStyle = '#000';
		context.lineWidth = 1;
		context.globalCompositeOperation = 'xor';
		context.beginPath();
		context.arc(
			this.#cursor.x,
			this.#cursor.y,
			this.#tools.halfSize,
			0,
			PI2
		);
		context.stroke();
		context.restore();
	}
	
	/**
	 * Рисует графику
	 */
	#draw()
	{
		if ( this.#linePoints.length < 2 )
		{
			return;
		}
		
		let point1 = this.#linePoints[0];
		let point2 = this.#linePoints[1];
		
		if ( !point1 || !point2 )
		{
			return;
		}
		
		const context = this.#stage.context;
		
		context.strokeStyle = this.#tools.getRgbaColor();
		context.lineWidth = this.#tools.size;
		context.lineJoin = context.lineCap = 'round';
		context.beginPath();
		context.moveTo( point1.x, point1.y );
		
		if ( point1.isEqual( point2 ) )
		{
			// Рисуем единичную точку
			context.lineTo( point2.x + 0.1, point2.y );
		}
		
		for ( let i = 1, n = this.#linePoints.length; i < n; i++ )
		{
			const middlePoint = calcMiddlePoint( point1, point2 );
			
			context.quadraticCurveTo(
				middlePoint.x,
				middlePoint.y,
				point2.x,
				point2.y,
			);
			
			point1 = this.#linePoints[i];
			point2 = this.#linePoints[i + 1];
			
			if ( !point1 || !point2 )
			{
				break;
			}
		}
		
		context.stroke();
		
		if ( this.#stage.isCacheUpdated() )
		{
			this.#linePoints = [];
		}
	}
}
