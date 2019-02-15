import React, {Component} from 'react';
import './App.css';

class Table extends Component {
  render() {
    var 
      cells = [],
      posX = 0,
      posY = 0;
    cells = initTable(cells);

    //Создаем функцию конструктор для массива с ячейками
    function CreateTable(posY, posX, color) {
      this.posX = posX;
      this.posY = posY;
      this.color = color;
    }

    function initTable(cells){
      //Генерируем массив с данными о каждой ячейке
      for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 4; j++) {
          let 
              first = 'blackcell',
              second = 'whitecell';
          if (i % 2 === 0) {
              first = 'whitecell'
              second = 'blackcell';   
          }
          cells.push(
            new CreateTable(posY, posX, second)
          );
          posX += 50;
          cells.push(
            new CreateTable(posY, posX, first)
          );
          posX += 50;
        }
        posY += 50;
        posX = 0;
      }
      return cells;
    }

//Отпраляем через коллбэк обьект c данными выбранной ячейки в App
    var handleClick = (e) => {
      var arr = [e.pageY, e.pageX];
            let scell = cells;

      for (var i = 0; i < scell.length; i++) {
        if(
            arr[0] >= scell[i].posY && arr[0] <= scell[i].posY + 50
            &&
            arr[1] >= scell[i].posX && arr[1] <= scell[i].posX + 50
          ){
            this.props.updateData(scell[i]);
        }
      }
    }

    return ( 
    <div className = 'table' > {
//Отрисовываем на странице ячейки по координатам Y X
        cells.map((value, index) => {
          return ( 
          <div className = {
              value.color
            }
            data-id = {
              'cell_' + index
            }       
            style = {
              {
                top: value.posY + 'px',
                left: value.posX + 'px'
              }
            }
            onClick = {
              (e) => handleClick(e)
            } >
            </div>
          );
        })
      } </div>
    );
  }
}

class Figure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      figselect: null,
      round : 'black'
    };
  }

  render() {
//Принимает и добавляем в стейт обьект c данными выбранной фигуры
    var handleClick = (e) => {
      var arr = [e.pageY, e.pageX];

      let figures = this.props.chess;
      
      for (var i = 0; i < figures.length; i++) {
        if(
            arr[0] >= figures[i].posY && arr[0] <= figures[i].posY + 50
            &&
            arr[1] >= figures[i].posX && arr[1] <= figures[i].posX + 50
          ){
            this.setState({
              figselect: figures[i]
            });
        }
      }
    }

    var figselect = this.state.figselect;
//Получем через props из App массив с фигурами и обьект с данными выбранной ячейки
    var Chess = this.props.chess;
    var cellselect = this.props.cellpos;
    var round = this.state.round;   

//Коллбэк для сбрасывания выбранной ячейки (стейта) в App    
    var cleanСell = ()=>{
      this.props.cleanCell(null);
    }
//Проверка на совпадения цвета и очереди хода
    var reviseRound = (color1, color2)=>{
      if (figselect.color === color1 ) {
        colorFig(color2);
      }else{
        cleanСell();
      }
    }
//Проверка направления хода и смена очереди (стейта)
  var colorFig = (color2)=>{
    if (color2 === 'black') {
      var direction ;
      if (figselect.posX < cellselect.posX) {
         direction = 'bR';
          movingFig(direction);
          cleanСell();
          this.setState({
            round : color2
          });  
      }else{
         direction = 'bL';
          movingFig(direction);
          cleanСell();
          this.setState({
            round : color2
          });
      }
    }else{
      if (figselect.posX < cellselect.posX) {
         direction = 'wR';
          movingFig(direction);
          cleanСell();
          this.setState({
            round : color2
          });  
      }else{
         direction = 'wL';
          movingFig(direction);
          cleanСell();
          this.setState({
            round : color2
          });
      }
    }
  }
//Функция для простого хода в зависимости от направления
  var simpleMove = (direction) => {
    if (direction === 'bR') {
      figselect.bRight();
    }else if(direction === 'bL') {
      figselect.bLeft();
    }else if(direction === 'wR'){
      figselect.wRight();
    }else if(direction === 'wL'){
      figselect.wLeft();
    }
  }

//Функция для двойного хода в зависимости от направления
  var superMove = (direction) => {
    if (direction === 'bR') {
      figselect.bbRight();
    }else if(direction === 'bL') {
      figselect.bbLeft();
    }else if(direction === 'wR'){
      figselect.wwRight();
    }else if(direction === 'wL'){
      figselect.wwLeft();
    }
  }
//Сбрасыываем figselect до значения после клика 
  var returnFigPos = (color,direction) =>{
    if (figselect.color == color) {
      if (direction == 'wR') {
        figselect.posX -= 50;
        figselect.posY += 50;
      }else{
        figselect.posX += 50;
        figselect.posY += 50;
      }
    }else{
      if (direction == 'bR') {
        figselect.posX -= 50;
        figselect.posY -= 50;
      }else{
        figselect.posX += 50;
        figselect.posY -= 50;
      }
    }
  }

//Проверяем есть ли в соседних ячейках фигуры для выбора типа хода
  var checkCell = (direction) =>{
//Готовим координаты соседней ячейки для сравнения 
//в зависимости от направления и цвета фигуры
    if (figselect.color == 'black') {
      if (direction == 'wR') {
        var Y = -50;
        var X = 50; 
      }else{
        var Y = -50;
      var  X = -50; 
      }
    }else{
      if (direction == 'bR') {
        var Y = 50;
        var X = 50; 
      }else{
        var Y = 50;
        var  X = -50; 
      }
    }
//Провряем есть ли на соседней ячейке фигура
    for (let i = 0; i < Chess.length; i ++) {
      if (
        Chess[i].posY === (figselect.posY + Y) 
        && Chess[i].posX === (figselect.posX + X)
        && Chess[i].color !== figselect.color
        ){
          returnFigPos('black',direction);
          superMove(direction);
          Chess = Chess.splice(i,1);
      }
    }
  }
  //Инициализируем ход в зависимости от checkCell
  var movingFig = (direction)=>{
   !checkCell(direction) && simpleMove(direction);
  }

//Проверяем если была выбрана фигура и ячейка и вызываем обработчик очереди
    if (cellselect != null && figselect != null) {
      if (cellselect.color !== 'whitecell') {
        if (round === 'black') {
          reviseRound('black','white');
        }else{
          reviseRound('white','black');
        }
      } 
    }

    return ( 
    <div > {
//Отрисовывем на странице фигуры по координатам Y X
        Chess.map((value, index) => {
          return ( 
          <div className = {
              value.color
            }
            data-id = {
              'figure_' + index
            }
            style = {
              {
                top: value.posY + 'px',
                left: value.posX + 'px'
              }
            }
            onClick = {
              (e) => handleClick(e)
            } >
            </div>
          );
        })
      } 
      <p>Ход : {round}</p>
      </div>
    );
  }
}

class App extends Component {
  state = {
    selectValue: null,
    chesss: []
  };
//коллбэк для получения координат выбранной ячейки из Table
// и добавления их в стейт
  updateData = (value) => {
    this.setState({
      selectValue: value
    })
  };
//коллбэк для сброса стейта (выбранная ячейка) из Figure
  cleanCell = (value) => {
    this.setState({
      selectValue: value
    })
  };

  componentWillMount() {
    var fRowLeft = 50,
      fRowTop = 0,
      black = "black",
      white = "white";

    var chess = [];
//Создаем функцию конструктор для фигур и методы для перемещения по доске
    function CreateObj(posY, posX, color) {
      this.posX = posX;
      this.posY = posY;
      this.color = color;
      this.wRight = function() {
        this.posY -= 50;
        this.posX += 50;
      }
      this.wLeft = function() {
        this.posY -= 50;
        this.posX -= 50;
      }
      this.bLeft = function() {
        this.posY += 50;
        this.posX -= 50;
      }
      this.bRight = function() {
        this.posY += 50;
        this.posX += 50;
      }
      this.wwRight = function() {
        this.posY -= 100;
        this.posX += 100;
      }
      this.wwLeft = function() {
        this.posY -= 100;
        this.posX -= 100;
      }
      this.bbLeft = function() {
        this.posY += 100;
        this.posX -= 100;
      }
      this.bbRight = function() {
        this.posY += 100;
        this.posX += 100;
      }
    }
//Создаем массив с данными о каждой фигуре
    for (var i = 0; i < 32; i++) {
      if (i <= 4 && i >= 1) {
        chess.push(
          new CreateObj(fRowTop, fRowLeft, white)
        );
        fRowLeft += 100;
      } else if (i > 4 && i <= 8) {
        chess.push(
          new CreateObj(fRowTop + 50, fRowLeft - 450, white)
        );
        fRowLeft += 100;
      } else if (i > 8 && i <= 12) {
        chess.push(
          new CreateObj(fRowTop + 100, fRowLeft - 800, white)
        );
        fRowLeft += 100;
      } else if (i > 12 && i <= 16) {
        chess.push(
          new CreateObj(fRowTop + 250, fRowLeft - 1250, black)
        );
        fRowLeft += 100;
      } else if (i > 16 && i <= 20) {
        chess.push(
          new CreateObj(fRowTop + 300, fRowLeft - 1600, black)
        );
        fRowLeft += 100;
      } else if (i > 20 && i <= 24) {
        chess.push(
          new CreateObj(fRowTop + 350, fRowLeft - 2050, black)
        );
        fRowLeft += 100;
      }
    }

//Добавляем в стейт полученный массив для использования его в рендере
    if (this.state.chesss == 0) {
      this.setState({
        chesss: chess
      });
    }
  }

  render() {
    var cellposition = this.state.selectValue;
//Отправляем в Figure массив с обьектами и координаты выбранной ячейки 
    return ( 
    <div >
      <Figure chess = {
        this.state.chesss
      }
      cellpos = {
        cellposition
      }
      cleanCell = {
        this.cleanCell
      }
      /><Table updateData = {
        this.updateData
      }
      /></div >
    );
  }
}

export default App;
