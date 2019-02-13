import React, {Component} from 'react';
import './App.css';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: 0
    };
  }

  render() {
    var cells = [],
      pox = 0,
      poy = 0;
//Создаем функцию конструктор для массива с ячейками
    function CreateTable(posY, posX, color) {
      this.posX = posX;
      this.posY = posY;
      this.color = color;
    }
//Генерируем массив с данными о каждой ячейке
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 4; j++) {
        if ((i % 2) == 0) {
          cells.push(
            new CreateTable(poy, pox, 'whitecell')
          );
          pox += 50;
          cells.push(
            new CreateTable(poy, pox, 'blackcell')
          );
          pox += 50;
        } else {
          cells.push(
            new CreateTable(poy, pox, 'blackcell')
          );
          pox += 50;
          cells.push(
            new CreateTable(poy, pox, 'whitecell')
          );
          pox += 50;
        }
      }
      poy += 50;
      pox = 0;
    }
//Отпраляем через коллбэк координаты выбранной ячейки в App
    var handleClick = (e) => {
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
      var arr = [e.pageY, e.pageX];
      this.setState({
        figselect: arr
      });
    }

    var figselect = this.state.figselect;
//Получем через props из App массив с фигурами и координаты выбранно ячейки
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

    console.log(figselect, cellselect);
//Проверяем если была выбрана фигура и ячейка 
    if (figselect !== null && cellselect !== null) {
      figround = round(figselect);
      cellround = round(cellselect);

      for (let i = 0; i < Chess.length; i++) {
//Сравниваем координаты и вызываем методы по условию
        if (Chess[i].posY === figround[0] && Chess[i].posX === figround[1]) {
          if (Chess[i].posX < cellround[1]) {
            Chess[i].right();
          } else {
            Chess[i].left();
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
      this.right = function() {
        this.posY += -50;
        this.posX += 50;
      }
      this.left = function() {
        this.posY += -50;
        this.posX += -50;
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
      /><Table updateData = {
        this.updateData
      }
      /></div >
    );
  }
}

export default App;
