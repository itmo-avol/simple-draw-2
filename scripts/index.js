import { Stage } from './stage.js';
import { Draw } from './draw.js';
import { Tools } from './tools.js';
import { SaveButton } from './save-button.js';

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
	
	const saveButtonElement = toolsForm.querySelector( 'a.save' );
	
	if ( saveButtonElement instanceof HTMLAnchorElement )
	{
		const saveButton = new SaveButton( saveButtonElement, canvas );
		
		saveButton.prepareCanvas = () =>
		{
			draw.update();
		};
	}
}

main();
