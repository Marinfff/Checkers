import React, {Component} from 'react';
import './App.css';

class Table extends Component {
  render() {
    var 
      cells = [],
      pox = 0,
      poy = 0;
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
            new CreateTable(poy, pox, second)
          );
          pox += 50;
          cells.push(
            new CreateTable(poy, pox, first)
          );
          pox += 50;
        }
        poy += 50;
        pox = 0;
      }
      return cells;
    }

    
    
//Отпраляем через коллбэк координаты выбранной ячейки в App
    var handleClick = (e) => {
      console.log('cell');
      var arr = [e.pageY, e.pageX];
      this.props.updateData(arr);
    }

    return ( 
    <div className = 'table' > {
//Отрисовываем на странице ячейки по координатам Y X
        cells.map((value, index) => {
          return ( 
          <div className = {
              value.color
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
      figselect: null
    };
  }

  render() {
    var figround, cellround;
//Принимает и добавляем в стейт координаты выбранной фигуры
    var handleClick = (e) => {

      console.log(e.currentTarget.dataset.id);
      var arr = [e.pageY, e.pageX];
      this.setState({
        figselect: arr
      });
      let figures = this.props.chess;
      

      let clickedCell = 0;

      for (var i = 0; i < figures.length; i++) {
        //console.log(figures[i], arr);
        console.log(arr);
        if(
            arr[0] >= figures[i].posY && arr[0] <= figures[i].posY + 50
            &&
            arr[1] >= figures[i].posX && arr[1] <= figures[i].posX + 50
          ){
          console.log(i);
        clickedCell = i;
        }
      }

      this.props.chess[clickedCell].posY -= 50;




    }

    var figselect = this.state.figselect;
//Получем через props из App массив с фигурами и координаты выбранной ячейки
    var Chess = this.props.chess;
    var cellselect = this.props.cellpos;   
//Округляем координаты кликов для сравнение с координатами обьектов в массиве
    var fround = (n) => {
      while (n % 50 !== 0) {
        n--;
      }
      return n;
    }
    var round = (arr) => {
      var arrr = [fround(arr[0]), fround(arr[1])];
      return arrr;
    }
//Функция для сброса координат выбранной ячейки через
//коллбэк для сбрасывания стейта в App    
    var cleanСell = ()=>{
      this.props.cleanCell(null);
    }

    //console.log(figselect, cellselect);
    //console.log(Chess);
//Проверяем если была выбрана фигура и ячейка 
    if (figselect !== null && cellselect !== null) {
      figround = round(figselect);
      cellround = round(cellselect);

      for (let i = 0; i < Chess.length; i++) {
//Сравниваем координаты и вызываем методы по условию
        if (Chess[i].posY === figround[0] && Chess[i].posX === figround[1]) {
          if (Chess[i].color == 'white') {
            if (Chess[i].posX < cellround[1]) {
              Chess[i].bRight();
              cleanСell();
              //console.log(Chess);
            } else {
                Chess[i].bLeft();
                cleanСell();
                //console.log(Chess);
            }
          }else{
            if (Chess[i].posX < cellround[1]) {
              Chess[i].wRight();
              cleanСell();
              //console.log(Chess);
            } else {
                Chess[i].wLeft();
                cleanСell();
                //console.log(Chess);
            }
          }
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
            data-id = {value.posY  + '_' + value.posX}
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
