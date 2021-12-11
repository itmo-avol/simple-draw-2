import { Stage } from './stage.js';
import { Draw } from './draw.js';
import { Tools } from './tools.js';

function main()
{
	const canvas = document.getElementById( 'draw-canvas' );
	const toolsForm = document.forms.namedItem( 'tools' );
	
	if (
		!canvas
		|| !( canvas instanceof HTMLCanvasElement )
		|| !toolsForm
	)
	{
		return;
	}
	
	const stage = new Stage( canvas );
	const tools = new Tools( toolsForm );
	const draw = new Draw( stage, tools );
}

main();
