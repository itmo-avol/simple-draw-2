import { Color } from './color.js';

/**
 * Панель инструментов
 */
export class Tools
{
	/**
	 * Элемент формы с инструментами
	 * @type {HTMLFormElement}
	 */
	#form;
	
	/**
	 * Инструмент изменения размера кисти
	 * @type {HTMLInputElement}
	 */
	#inputSize;
	/**
	 * Инструмент изменения плотности кисти
	 * @type {HTMLInputElement}
	 */
	#inputOpacity;
	/**
	 * Инструмент изменения цвета кисти
	 * @type {HTMLInputElement}
	 */
	#inputColor;
	
	/**
	 * Размер кисти
	 */
	#size = 0;
	/**
	 * Половина размера кисти
	 */
	#halfSize = 0;
	/**
	 * Плотность кисти
	 */
	#opacity = 1;
	/**
	 * Цвет кисти
	 */
	#color = new Color();
	/**
	 * Контроллер прерывания работы класса
	 * @type {AbortController}
	 */
	#commonAbortController;
	
	/**
	 * @param {HTMLFormElement} form
	 */
	constructor( form )
	{
		this.#form = form;
		
		form.addEventListener(
			'submit',
			( event ) => event.preventDefault(),
		);
		
		this.#commonAbortController = new AbortController();
		
		this.#inputSize = this.#getFormInput( 'size' );
		this.#inputOpacity = this.#getFormInput( 'opacity' );
		this.#inputColor = this.#getFormInput( 'color' );
		
		this.#initSizeTool();
		this.#initOpacityTool();
		this.#initColorTool();
	}
	
	/**
	 * Очищает данные класса
	 */
	destroy()
	{
		this.#commonAbortController.abort();
	}
	
	/**
	 * Размер кисти
	 */
	get size()
	{
		return this.#size;
	}
	
	/**
	 * Размер кисти
	 */
	set size( value )
	{
		this.#size = Math.max(
			1,
			value,
		);
		this.#halfSize = Math.round( this.#size / 2 );
		this.#inputSize.value = String( this.#size );
	}
	
	/**
	 * Половина размера кисти
	 */
	get halfSize()
	{
		return this.#halfSize;
	}
	
	/**
	 * Плотность кисти
	 */
	get opacity()
	{
		return this.#opacity;
	}
	
	/**
	 * Плотность кисти
	 */
	set opacity( value )
	{
		this.#opacity = Math.min(
			Math.max(
				0,
				value
			),
			1
		);
		
		if ( isNaN( this.#opacity ) )
		{
			this.#opacity = 1;
		}
		
		this.#inputOpacity.value = this.#opacity.toFixed( 2 );
	}
	
	/**
	 * Цвет кисти
	 */
	get color()
	{
		return this.#color;
	}
	
	/**
	 * Цвет кисти
	 */
	set color( color )
	{
		this.#color = color;
		this.#inputColor.value = color.toHex();
	}
	
	/**
	 * Возвращает цвет, в формате rgba(R, G, B, A)
	 */
	getRgbaColor()
	{
		return `rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#opacity})`;
	}
	
	/**
	 * Возвращает поле ввода на форме
	 * @param {string} name
	 */
	#getFormInput( name )
	{
		const input = this.#form.elements.namedItem( name );
		
		if (
			!input
			|| !( input instanceof HTMLInputElement )
		)
		{
			throw new Error( `Can't find element "${name}"` );
		}
		
		return input;
	}
	
	/**
	 * Инициализирует инструмент изменения размера кисти
	 */
	#initSizeTool()
	{
		this.#inputSize.value = this.#inputSize.defaultValue;
		
		const handleInput = () =>
		{
			this.size = Number( this.#inputSize.value ) | 0;
		};
		
		this.#inputSize.addEventListener(
			'input',
			handleInput,
			{
				signal: this.#commonAbortController.signal,
			},
		);
		handleInput();
	}
	
	/**
	 * Инициализирует инструмент изменения плотности кисти
	 */
	#initOpacityTool()
	{
		this.#inputOpacity.value = this.#inputOpacity.defaultValue;
		
		const handleInput = () =>
		{
			this.opacity = Number( this.#inputOpacity.value );
		};
		
		this.#inputOpacity.addEventListener(
			'input',
			handleInput,
			{
				signal: this.#commonAbortController.signal,
			},
		);
		handleInput();
	}
	
	/**
	 * Инициализирует инструмент выбора цвета кисти
	 */
	#initColorTool()
	{
		this.#inputColor.value = this.#inputColor.defaultValue;
		
		const onInput = () =>
		{
			this.color = Color.fromHex( this.#inputColor.value );
		};
		
		this.#inputColor.addEventListener(
			'input',
			onInput,
			{
				signal: this.#commonAbortController.signal,
			},
		);
		onInput();
	}
}
