//Global Variables
var DOMStrings = {
  inputType: ".add__type",
  inputDescription: ".add__description",
  inputValue: ".add__value",
  addButon: ".add__btn",
  incomeContainer: ".income__list",
  expensesContainer: ".expenses__list",
  incomeHTML:
    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">-%value</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
  expensesHTML:
    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">-%value</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
}; //Easy way of updating queryselector values if any class names were to change

//Budget Controller
var budgetController = (function () {
  //some code
  var totalExpenses = 0;
  var incomeItemID = 0;
  var expenseItemID = 0;
  var Expenses = [];
  var Incomes = [];
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var data = {
    allitems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function (type, description, value) {
      var newItem;
      //creates n ew id

      //var id = data.allitems[type][data.allitems[type].length - 1].id + 1;
      //determines what kind of item it is
      //expense or income
      if (type === "exp") {
        newItem = new Expense(expenseItemID, description, value);
        expenseItemID++;
      } else if (type === "inc") {
        newItem = new Income(incomeItemID, description, value);
        incomeItemID++;
      }
      data.allitems[type].push(newItem);
      console.log(newItem);
      return newItem; //returns new elements
    },
    printItems: function () {
      console.log(data);
    },
  };
})();

//Controls elements of the UI
var UIController = (function () {
  //private methods

  return {
    //public methods
    getInput: function () {
      return {
        //Returns an object containing the three input fields
        type: document.querySelector(DOMStrings.inputType).value,
        desc: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },

    addListItem: function (obj, type) {
      // create html string with placeholder text
      var html, hewHTML, element;
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html = DOMStrings.incomeHTML;
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html = DOMStrings.incomeContainer;
      }
      //replace placeholder text with actual data from the passed in object
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //insert html into the dom
    },
  };
})();

//Global app controller
var Controller = (function (budgetCtrl, uiCtrl) {
  var setupEventListeniners = function () {
    document
      .querySelector(DOMStrings.addButon)
      .addEventListener("click", CtrlAddItem);

    document.addEventListener("keypress", function (event) {
      //console.log(event);
      //console.log(event.key);
      //console.log(event.keyCode);
      if (event.keyCode === 13 || event.which === 13) {
        //console.log("Enter was pressed.");
        //Call CtrlAddItem function to add item to the list
        CtrlAddItem();
      }
    });
  };

  //Gather input data
  var CtrlAddItem = function () {
    //Where you add item
    var input = uiCtrl.getInput();
    //Add the item to the budget controller
    var newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

    //Add a new item to the UI showing the item ont he list

    //Calculate budget

    //Display the budget

    //Clear input field
  };

  //Init, made public by returning, is called outside all of the controllers
  return {
    init: function () {
      setupEventListeniners();
    },
  };
})(budgetController, UIController); //This controller will handle the other two controllers
//You pass in the other modules into this one

Controller.init();
