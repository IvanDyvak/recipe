var recipeController = (function() {
// Creating object for recipes


    var Recipe = function (id, name, ingredients, process, year){
        this.id = id;
        this.name = name;
        this.ingredients = ingredients;
        this.process = process;
        this.year = year;
    }

    if (typeof(Storage) !== "undefined") {

        var recipeCollection = localStorage.getItem('recipes')
            ? JSON.parse(localStorage.getItem('recipes'))
            : [];

        console.log(recipeCollection);

        //Storing recipes Array in Localstorage//

        localStorage.setItem('recipes', JSON.stringify(recipeCollection));
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }


    //////////////////////////////

    return {
        addItem: function(name, ings, proc) {
            var newItem, ID, yearOfPosted, now, months, month, yearPub, year;

            // Create new ID
            if (recipeCollection.length > 0) {
                ID = recipeCollection[recipeCollection.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Generating date
            yearOfPosted = [];
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            yearOfPosted.push(months[month]);
            yearPub = now.getFullYear();
            yearOfPosted.push(yearPub);
            year = yearOfPosted.join(", ");

            // Create new item

            newItem = new Recipe(ID, name, ings, proc, year);

            // Push it into our data structure
            recipeCollection.push(newItem);
            localStorage.setItem('recipes', JSON.stringify(recipeCollection));
            // Return the new element
            return newItem;

        },
        addSaveItem: function(ID, name, ings, proc) {
            var newItem, ids, yearOfPosted, now, months, month, yearPub, year;


            //Generating date
            yearOfPosted = [];
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            yearOfPosted.push(months[month]);
            yearPub = now.getFullYear();
            yearOfPosted.push(yearPub);
            year = yearOfPosted.join(", ");

            // // Create new item

            var id = Number(ID);
            newItem = new Recipe(id, name, ings, proc, year);
            // // Push it into our data structure

            ids = recipeCollection.map(function(current) {
                return current.id;
            });
            var  index = ids.indexOf(id);
            recipeCollection.splice(index, 1, newItem);

            localStorage.setItem('recipes', JSON.stringify(recipeCollection));
            // Return the new element
            return newItem;

        },

        deleteItem: function(id) {
            var ids, index;

            ids = recipeCollection.map(function(current) {

                return current.id;

            });

            index = ids.indexOf(id);

            // if (index !== -1) {
            recipeCollection.splice(index, 1);
            // }
            localStorage.setItem('recipes', JSON.stringify(recipeCollection));
        },

        editItem: function(ID) {
            var obj;
            recipeCollection.map(function(current) {
                if (ID == current.id){

                    obj = {
                        id: current.id,
                        name: current.name,
                        ingredients: current.ingredients,
                        process: current.process,
                        year: current.year,
                    }

                }
            });
            // console.log(obj);
            return obj;
        },
    };


})();

var UIController = (function (){
    // Creating list of ingredients


    var btn2 = document.getElementById("btn2").addEventListener("click", addIng);

    function addIng(){
        var liElement = document.createElement('li');
        var ingInput = document.createElement('input');
        var iElem = document.createElement('i');

        liElement.appendChild(ingInput);
        liElement.appendChild(iElem);
        iElem.setAttribute('class', 'trash far fa-trash-alt');
        ingInput.classList.add('ingName');
        var ingList = document.getElementById('ingList');
        ingInput.placeholder = "New ingredient";
        liElement.classList.add('class', 'ingItem');
        ingList.insertBefore(liElement, ingList.firstChild);

        var trash = document.querySelectorAll('.trash');
        var trashArr = Array.prototype.slice.call(trash);
        trashArr.forEach(function (cur) {
            cur.addEventListener("click", removeIng);
        })

    }
    function removeIng(e){
        var li = e.target.parentElement;
        var ul = document.getElementById("ingList");
        ul.removeChild(li);
    }

// Deleting items in the list of ingredients


//Manipulating nav//
    window.onscroll = function() {myFunction()};

    function myFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            document.querySelector(".wrapper").style.top = "-30px";
            document.querySelector(".logo").style.width = "130px";
            document.querySelector(".logo").style.height = "35px";
            document.querySelector(".logo").style.transform = "translateX(15%)";

        } else {
            document.querySelector(".logo").style.width = "150px";
            document.querySelector(".logo").style.height = "40px";
            document.querySelector(".wrapper").style.top = "0px";
            document.querySelector(".navbar").style.height = "auto";
            document.querySelector(".logo").style.transform = "translateX(0)";

        }
    }

    var loginSignIn = document.querySelector('.login_signin');
    var loginSignUp = document.querySelector('.login_signup');
    var navbarFormSignIn = document.querySelector('.navbar_form_sign_in');
    var navbarFormsignUp = document.querySelector('.navbar_form_sign_up');
    // var navbarForm = document.querySelector('.navbar_form');
    var overlay = document.getElementById('overlay');

    document.onclick = function(e){
        if(e.target.id == 'overlay'){
            navbarFormSignIn.style.display = 'none';
            overlay.style.zIndex = '0';
        }
        if(e.target === loginSignIn){
            navbarFormSignIn.style.display = 'block';
            overlay.style.zIndex = '10';
        }
    };

    document.onclick = function(e){
        if(e.target.id == 'overlay'){
            navbarFormsignUp.style.display = 'none';
            overlay.style.zIndex = '0';
        }
        if(e.target === loginSignUp){
            navbarFormsignUp.style.display = 'block';
            overlay.style.zIndex = '10';
        }
    };



    ///Collecting value from inputs
    return {
        getInput: function() {

            var data = {
                name: document.getElementById("recipeName").value,
                process: document.getElementById("cookingProcess").value
            }
            var ingName = document.querySelectorAll('.ingName');
            var ingArr = [];
            var ingNameArr = Array.prototype.slice.call(ingName);
            ingNameArr.forEach(function(current, index, array) {
                ingArr.push(current.value);
            });

            data.ingredients = ingArr;

            return data;

        },

        getSaveInput: function() {
            var data = {
                id: document.querySelector('.item_edit_form').id,
                name: document.getElementById("save_input_name").value,
                process: document.getElementById("process").value
            }
            var ingName = document.querySelectorAll('.input_name');
            var ingArr = [];
            var ingNameArr = Array.prototype.slice.call(ingName);
            ingNameArr.forEach(function(current, index, array) {
                ingArr.push(current.value);
            });

            data.ingredients = ingArr;
            return data;

        },

        addListItem: function(obj) {
            var html, newHtml, element;

            element = document.querySelector('.recipe_container');

            html = '<div class="item clearfix" id="%id%"><h4 class="recipe_value">%name%</h4><div class="recipe_ingredients"> <p>INGREDIENTS</p> <ul class="ingredient_value"></ul></div><div><p>METHOD</p><p class="recipe_method">%process%</p><div><p class="date"></p></div><div class="btn_control">                                        <button class="btn btn-info" title="Edit post"><i class="far fa-edit"></i></button><button class="btn  btn-danger" id="" title="Delete post"><i class="far fa-times-circle btn_delete"></i></button></div><p class="today">Published: %year%</p></div></div>';

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name);
            newHtml = newHtml.replace('%process%', obj.process);
            newHtml = newHtml.replace('%year%', obj.year),

                // Insert the HTML into the DOM
                element.insertAdjacentHTML('afterbegin', newHtml);

            obj.ingredients.forEach(function (item){
                var li = document.createElement("li");
                li.innerText = item;
                var ingredientValue = document.querySelector(".ingredient_value");
                if (item !== ""){
                    ingredientValue.appendChild(li);
                }
            });
        },

        editListItem: function(obj) {
            var html, newHtml, overlay;

            overlay = document.getElementById('overlaySecond');
            overlay.style.display = 'block';

            html = '<div class="item clearfix item_edit_form" id="%id%"><h4 class="recipe_value"><input id="save_input_name" value="%name%" class="form-control" type="text"/></h4><div class="recipe_ingredients"> <p>INGREDIENTS</p> <ul class="edit_ingredient_value"></ul></div><div><p>METHOD</p><p class="recipe_method"><textarea class="form-control" id="process" cols="45" rows="5">%process%</textarea></p><div><p class="date"></p></div><div class="btn_control"><input id="save" class="btn btn-light m-1" type="submit" value="Save"></div><p class="today">Published: %year%</p></div></div>';


            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%name%', obj.name);
            newHtml = newHtml.replace('%process%', obj.process);
            newHtml = newHtml.replace('%year%', obj.year),


                // Insert the HTML into the DOM
                overlay.insertAdjacentHTML('afterbegin', newHtml);


            obj.ingredients.forEach(function (item){
                var liElement, newLiElement;

                var editIngredientValue = document.querySelector(".edit_ingredient_value");

                liElement = '<li class="ingItem"><input class="input_name" value="%value%"><i class="trash far fa-trash-alt"></i></li>';

                newLiElement = liElement.replace('%value%', item);

                editIngredientValue.insertAdjacentHTML('afterbegin', newLiElement);

            });
            var itemEditForm = document.querySelector('.item_edit_form');
            document.onclick = function(e){
                if(e.target.id == 'overlaySecond'){
                    itemEditForm.parentNode.removeChild(itemEditForm);
                    overlaySecond.style.display = 'none';
                }
                if(e.target === itemEditForm){
                    itemEditForm.style.display = 'block';
                }
            };

            var trash = document.querySelectorAll('.trash');
            var trashArr = Array.prototype.slice.call(trash);
            trashArr.forEach(function (cur) {
                cur.addEventListener("click", removeIng);
            })

            function removeIng(event){
                var el = event.target.parentNode;
                el.parentNode.removeChild(el);
            }

        },



        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },


        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll('#recipeName' + ', ' + '.ingName' + ', ' + '#cookingProcess');

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();

            function delItem() {
                var ul = document.getElementById('ingList');
                while (ul.hasChildNodes()) {
                    ul.removeChild(ul.firstChild);
                }
            }delItem();

        },


    };




})();
// GLOBAL APP CONTROLLER
var controller = (function(recipeCtrl, UICtrl) {
    var setupEventListeners = function() {
        document.getElementById('add_item').addEventListener('click', ctrlAddItem);

        // document.addEventListener('keypress', function(event) {
        //     if (event.keyCode === 13 || event.which === 13) {
        //         ctrlAddItem();
        //     }
        // });

    };

// ******************RANDOMIZING TIPS DAILY********************

    window.addEventListener('load', function() {
        var userDate, now;

        now = new Date().getDate();

        if (localStorage.getItem('user')) {
            userDate = JSON.parse(localStorage.getItem('user'))

        } else {
            userDate = localStorage.setItem('user', JSON.stringify(now));
        }

        if (userDate != now){
            fetch('json/tips.json')
                .then(response => response.json())
                .then(data => {

                    function randomRange(min, max) {
                        return (Math.random() * (max - min + 1)) + min
                    }
                    var tip = parseInt(randomRange(0, data.length - 1));
                    localStorage.setItem('currentTip', JSON.stringify(tip));
                    console.log(localStorage.getItem('currentTip'));

                    for (i = 0; i < data.length; i++){
                        var thisTip = data[tip].description;
                        document.getElementById('tip_text').innerText = thisTip;
                    }
                    localStorage.setItem('user', JSON.stringify(now));
                })
        }
        else{
            fetch('json/tips.json')
                .then(response => response.json())
                .then(data => {
                    var currentTip = JSON.parse(localStorage.getItem('currentTip'))
                    for (i = 0; i < data.length; i++){
                        var thisTip = data[currentTip].description;
                        document.getElementById('tip_text').innerText = thisTip;
                    }

                })
        }

    });
    /**********************************************************************/
    //    ***********CREATING SEARCH LOADER*****************
    //         document.getElementById('search_btn').addEventListener('click', function(){
    //             var searchOverlay = document.getElementById('search_overlay').style.display = 'block';
    //             setTimeout(function (){
    //                 document.getElementById('search_overlay').style.display = 'none';
    //             }, 10000);
    // });


    // ************************************************************




    var postFromStor = function(){
        var data = JSON.parse(localStorage.getItem('recipes'));
        data.forEach(function(cur) {
            UICtrl.addListItem(cur);
        });
        var delBtn = document.querySelectorAll('.btn_delete');
        var delArr = Array.prototype.slice.call(delBtn);
        delArr.forEach(function (cur) {
            cur.addEventListener("click", ctrlDeleteItem);
        })
        var editBtn = document.querySelectorAll('.fa-edit');
        var editArr = Array.prototype.slice.call(editBtn);
        editArr.forEach(function (cur) {
            cur.addEventListener("click", ctrlEditItem);
        })

    };
    // var editBtn = document.querySelectorAll('.fa-edit');
    // var editArr = Array.prototype.slice.call(editBtn);
    // editArr.forEach(function (cur) {
    //     cur.addEventListener("click", ctrlEditItem);
    // })


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.name == "") {
            alert('Please type your recipe name')
        } else {
            // 2. Add the item to the recipe controller
            newItem = recipeCtrl.addItem(input.name, input.ingredients, input.process);
            // console.log(input.ingredients);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem);

            var delBtn = document.querySelectorAll('.btn_delete');
            var delArr = Array.prototype.slice.call(delBtn);
            delArr.forEach(function (cur) {
                cur.addEventListener("click", ctrlDeleteItem);
            })

            var editBtn = document.querySelectorAll('.fa-edit');
            var editArr = Array.prototype.slice.call(editBtn);
            editArr.forEach(function (cur) {
                cur.addEventListener("click", ctrlEditItem);
            })

            // // 4. Clear the fields
            UICtrl.clearFields();
        }
    };
    var ctrlDeleteItem = function(event) {
        var ID;

        ID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // 1. delete the item from the data structure
        recipeCtrl.deleteItem(ID);


        // 2. Delete the item from the UI
        UICtrl.deleteListItem(ID);

    };
    var ctrlEditItem = function(event) {

        var ID, newItem;

        ID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(ID);
        newItem = recipeCtrl.editItem(ID);

        UICtrl.editListItem(newItem);

        document.getElementById('save').addEventListener('click', saveItem);
    };

    var saveItem = function (){

        var input = UICtrl.getSaveInput();
        recipeCtrl.addSaveItem(input.id, input.name, input.ingredients, input.process);

        function delItem() {
            var recipeContainer = document.querySelector('.recipe_container');
            while (recipeContainer.hasChildNodes()) {
                recipeContainer.removeChild(recipeContainer.firstChild);
            }
        }delItem();

        document.getElementById('overlaySecond').style.display = 'none';
        var itemEditForm = document.querySelector('.item_edit_form');
        itemEditForm.parentNode.removeChild(itemEditForm);
        postFromStor();
    };

    return {
        init: function() {
            postFromStor();
            console.log('Application has started.');
            setupEventListeners();
        }
    };

})(recipeController, UIController);
controller.init();
