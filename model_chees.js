class Game{

	constructor(){
		let actions = [];
		let currentPlayer = 'white';
	}

	init(){
		Table.draw()
		let data = loadFiguresData()
		Figure.putAll(data)
		setStartColor('black')
		startGame()
	}

	setStartColor(playerColor){
		this.currentPlayer = playerColor
	}

	startGame(){
		handleClickFigure()
		handleClickCell()
	}

	loadFiguresData(){
		//load JSON and return
	}

	handleClickFigure(){
		onclick = function (){
			Figure.getCurrentPosition()
			this.saveAction('selectFigure', this.currentPlayer, Figure.getCurrentPosition())
		}
	}
	handleClickCell(){
		onclick = function (){
			Table.getCurrentPosition()
			let lastAction = getLastElement(this.actions);
			if(lastAction.action === 'selectFigure'){
				let moveType = determiteMoveType();
				switch(moveType){
					'move':
						moveFigure()					
						break;
					'beat':
						beatFigure();
						break;
					default:
					//do something
				}
				
			}
		}
	}

	determiteMoveType(){
		//depend on positions, return 'move' or 'beat'
	}


	moveFigure(){
		Figure.move()
		this.saveAction('moveFigure', this.currentPlayer, Table.getCurrentPosition())	
	}

	beatFigure(){
		Figure.beat()
		this.saveAction('beatFigure', this.currentPlayer, Table.getCurrentPosition())
	}

	saveAction(action, player, position){
		this.actions.push([action, player, position]);
	}

	getLastElement(){
		//return last actions array element
	}
}


class Table{
	constructor(){
		this.figures = [];
		this.options = {
			cellSize: {
				x: 50, 
				y, 50
			}, 
			colors:{
				white:{
					background: '#ffe'
				}
			}
		}
	}

	draw(){
		//draw table cells
	}

	getCurrentPosition(){
		//depend on coordinates or id of elements
	}

}

class Figure{
	setColor(){

	}

	putAll(){
		foreach(figures as figure)
			Figure.putOnTable(figure)			
	}

	putOnTable(){
		setColor()
		//real put on table

	}

	move(){

	}

	beat(){

	}

	setNewPosition(){

	}

	getCurrentPosition(){

	}
}