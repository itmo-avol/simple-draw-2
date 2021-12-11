export class Color
{
	/**
	 * Создаёт объект цвета, на основе шестнадцатеричной записи
	 * @param {string} hexColor
	 */
	static fromHex( hexColor )
	{
		if ( hexColor.length === 4 )
		{
			return new Color(
				parseInt( hexColor[1] ?? '' + hexColor[1] ?? '', 16 ) | 0,
				parseInt( hexColor[2] ?? '' + hexColor[2] ?? '', 16 ) | 0,
				parseInt( hexColor[3] ?? '' + hexColor[3] ?? '', 16 ) | 0,
			);
		}
		
		return new Color(
			parseInt( hexColor.substr( 1, 2 ), 16 ) | 0,
			parseInt( hexColor.substr( 3, 2 ), 16 ) | 0,
			parseInt( hexColor.substr( 5, 2 ), 16 ) | 0,
		);
	}
	
	#r = 0;
	#g = 0;
	#b = 0;
	
	constructor( r = 0, g = 0, b = 0 )
	{
		this.r = r;
		this.g = g;
		this.b = b;
	}
	
	get r()
	{
		return this.#r;
	}
	
	set r( value )
	{
		this.#r = this.#normalize( value );
	}
	
	get g()
	{
		return this.#g;
	}
	
	set g( value )
	{
		this.#g = this.#normalize( value );
	}
	
	get b()
	{
		return this.#b;
	}
	
	set b( value )
	{
		this.#b = this.#normalize( value );
	}
	
	/**
	 * Возвращает шестнадцатеричную запись цвета
	 */
	toHex()
	{
		return `#${this.#toColorPart( this.#r )}${
			this.#toColorPart( this.#g )
		}${this.#toColorPart( this.#b )}`;
	}
	
	/**
	 * Нормализует составляющую цвета
	 * @param {number} value
	 */
	#normalize( value )
	{
		return Math.min(
			Math.max(
				value | 0,
				0
			),
			255
		);
	}
	
	/**
	 * Формирует шестнадцатеричную запись фрагмента цвета
	 * @param {number} value
	 */
	#toColorPart( value )
	{
		const hex = value.toString( 16 );
		
		return (
			( hex.length > 1 )
			? hex
			: '0' + hex
		);
	};
}
