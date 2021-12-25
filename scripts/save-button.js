/**
 * Объект кнопки сохранения
 */
export class SaveButton
{
	/**
	 * Ссылка для скачивания
	 * @type {HTMLAnchorElement}
	 */
	#saveElement;
	/**
	 * Холст, который нужно сохранять
	 * @type {HTMLCanvasElement}
	 */
	#canvas;
	/**
	 * Контроллер прерывания работы класса
	 * @type {AbortController}
	 */
	#commonAbortController;
	/**
	 * @type {() => void}
	 */
	#updateHrefBound;
	
	/**
	 * Подготавливает холст к сохранению
	 */
	prepareCanvas = () => {};
	
	/**
	 * @param {HTMLAnchorElement} saveElement
	 * @param {HTMLCanvasElement} canvas
	 */
	constructor( saveElement, canvas )
	{
		this.#saveElement = saveElement;
		this.#canvas = canvas;
		
		this.#commonAbortController = new AbortController();
		
		this.#updateHrefBound = this.#updateHref.bind( this );
		
		this.#registerHandlers();
		this.#updateHref();
	}
	
	/**
	 * Очищает данные класса
	 */
	destroy()
	{
		this.#commonAbortController.abort();
	}
	
	/**
	 * Регистрирует обработчики событий
	 */
	#registerHandlers()
	{
		this.#saveElement.addEventListener(
			'click',
			this.#updateHrefBound,
			{
				signal: this.#commonAbortController.signal,
			},
		);
		this.#saveElement.addEventListener(
			'focus',
			this.#updateHrefBound,
			{
				signal: this.#commonAbortController.signal,
			},
		);
	}
	
	/**
	 * Обновляет атрибут href у ссылки
	 */
	#updateHref()
	{
		this.prepareCanvas();
		this.#saveElement.href = this.#canvas.toDataURL( 'image/png' );
	}
}
