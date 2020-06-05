//TODO FIGURE OUT PER ITEM PERCENTAGES

//Global Variables
var DOMStrings = {
  inputType: ".add__type",
  inputDescription: ".add__description",
  inputValue: ".add__value",
  addButon: ".add__btn",
  incomeContainer: ".income__list",
  expensesContainer: ".expenses__list",
  incomeHTML:
    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
  expensesHTML:
    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-$%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
  budgetTotal: ".budget__value",
  budgetIncome: ".budget__income--value",
  budgetExpenses: ".budget__expenses--value",
  budgetPercentage: ".budget__expenses--percentage",
  monthText: ".budget__title--month",
  container: ".container ",
  expensesPercLabel: ".item__percentage",
}; //Easy way of updating queryselector values if any class names were to change
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Budget Controller
var budgetController = (function () {
  //some code
  var totalExpenses = 0;
  var totalBudget = 0;
  var totalIncome = 0;
  var incomeItemID = 0;
  var expenseItemID = 0;
  var Expenses = [];
  var Incomes = [];
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    budget: 0,
    percentage: 0,
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allitems[type].forEach(function (current) {
      sum = sum + current.value;
    });
    data.totals[type] = sum;
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
      data.totals[type] += newItem.value;
      //(newItem);
      return newItem; //returns new elements
    },
    removeItem: function (type, id) {
      var ids = data.allitems[type].map(function (current) {
        return current.id;
      });
      //(ids);
      var index = ids.indexOf(id);
      //(index);
      if (index !== -1) {
        data.allitems[type].splice(index, 1);
      }
      //(data.allitems[type]);
    },
    printItems: function () {
      data;
    },
    caclulateBudget: function () {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals["inc"] - data.totals["exp"];
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },
    calculatePercentages: function () {
      data.allitems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
        //console.log(cur);
      });
    },
    getPercentages: function () {
      var allPerc = data.allitems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      //console.log(allPerc);
      return allPerc;
    }, //returns an array of budgets
    getBudget: function () {
      return data.budget;
    },
    getTotals: function (type) {
      return data.totals[type];
    },
    getPercentage: function () {
      return data.percentage;
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
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      // create html string with placeholder text
      //(obj, type);
      var html, newHTML, element, insert;
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html = DOMStrings.incomeHTML.toString();
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html = DOMStrings.expensesHTML.toString();
      }
      //replace placeholder text with actual data from the passed in object
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);

      //insert html into the dom
      insert = document.querySelector(element);
      insert.insertAdjacentHTML("afterend", newHTML);
      //document.querySelector
      //document.getElementById(element).insertAdjacentHTML("afterend", newHTML);
    },
    removeListItem: function (id) {
      //(id);
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    clearInput: function () {
      //document.querySelector(DOMStrings.inputType).value = null;
      //document.querySelector(DOMStrings.inputDescription).value = null;
      //document.querySelector(DOMStrings.inputValue).value = null;
      var fields = document.querySelectorAll(
        DOMStrings.inputValue + ", " + DOMStrings.inputDescription
      );
      var fieldsArr = Array.from(fields); //querySelectorAll creates a NodeList, this converts it into an Array
      fieldsArr.forEach((value) => {
        value.value = "";
      });
    },
    updateBudget: function (budget, income, expenses) {
      document.querySelector(DOMStrings.budgetTotal).innerHTML = "$" + budget;
      document.querySelector(DOMStrings.budgetIncome).innerHTML = "$" + income;
      document.querySelector(DOMStrings.budgetExpenses).innerHTML =
        "$" + expenses;
    },
    updateBudgetPercentage: function (percentage) {
      if (!isNaN(percentage) && isFinite(percentage)) {
        document.querySelector(DOMStrings.budgetPercentage).innerHTML =
          percentage + "%";
      } else {
        document.querySelector(DOMStrings.budgetPercentage).innerHTML = "0%";
      }
    },
    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
      console.log(percentages);
      console.log(fields);
      fields.forEach(function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    setMonth: function (m) {
      document.querySelector(DOMStrings.monthText).innerHTML = monthNames[m];
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
      //(event);
      //(event.key);
      //(event.keyCode);
      if (event.keyCode === 13 || event.which === 13) {
        //("Enter was pressed.");
        //Call CtrlAddItem function to add item to the list
        CtrlAddItem();
      }

      document
        .querySelector(DOMStrings.container)
        .addEventListener("click", ctrlDeleteItm);
    });
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    //Returns an array of
    var percentages = budgetCtrl.getPercentages();
    //console.log(percentages);

    // 3. Uthe new percentages
    uiCtrl.displayPercentages(percentages);
  };

  var recalcBudget = function () {
    var b, i, e, p;
    //Calculate budget
    var b, i, e, p;
    budgetCtrl.caclulateBudget();
    b = budgetCtrl.getBudget();
    p = budgetCtrl.getPercentage();

    //Display the budget

    i = budgetCtrl.getTotals("inc");

    e = budgetCtrl.getTotals("exp");
    // (i);
    //(e);
    uiCtrl.updateBudget(b, i, e);
    uiCtrl.updateBudgetPercentage(p);

    //update percentages
    updatePercentages();

    //Clear input field
    uiCtrl.clearInput();
  };

  //Gather input data
  var CtrlAddItem = function () {
    //Where you add item
    var input = uiCtrl.getInput();
    //Add the item to the budget controller
    if (input.description !== "" && !isNaN(input.value) && input.value >= 0) {
      var newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

      //Add a new item to the UI showing the item ont he list
      uiCtrl.addListItem(newItem, input.type);

      //Calculate budget
      recalcBudget();
    } else {
      alert("Please ensure proper input.");
    }
  };

  var ctrlDeleteItm = function (event) {
    //(event.target);
    //(event.target.parentNode.parentNode.parentNode.parentNode);
    var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    //i.removeChild(p);
    if (itemID) {
      //var elementToRemove = document.getElementById(itemID);
      //get id
      splitID = itemID.split("-");
      type = splitID[0];
      idToDelete = parseInt(splitID[1]);
      splitID;
      type;
      //(ID);

      //remove from data structure
      budgetCtrl.removeItem(type, idToDelete);

      //remove from UI
      uiCtrl.removeListItem(itemID);
      //update budget + percentages
      recalcBudget();
    }
  };

  var setDate = function () {
    var d = new Date();
    var m = d.getMonth();
    uiCtrl.setMonth(m);
  };

  //Init, made public by returning, is called outside all of the controllers
  return {
    init: function () {
      setupEventListeniners();
      setDate();
    },
  };
})(budgetController, UIController); //This controller will handle the other two controllers
//You pass in the other modules into this one

Controller.init();
