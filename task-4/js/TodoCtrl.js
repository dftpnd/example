'use strict';

var TodoCtrl = function (Todo) {

    var $todoContainer = $('.todo-container');
    var $todoForm = $('#todoForm');


    /**
     *
     * @param todo
     * @returns {string}
     */
    function buildItemtemplate(item) {
        var html =
            '<li>' +
            '<a href="#" class="todo-app__remove_link">' + 'Удалить' + '</a>' +
            '<span class="todo-app__title">' + item.title + '</span>' +
            '<span class="todo-app__author">' + item.author + '</span>' +
            '<span class="todo-app__date">' + item.date + '</span>' +
            '</li>';
        return html;
    };

    /**
     *
     * @param list
     */
    function addItems(list) {
        $todoContainer.html();

        list.forEach(function (todo) {
            var item = addItem(todo);
            item.click(todoClick);
        });
    };

    /**
     *
     * @param todo
     * @returns {*|jQuery}
     */
    function addItem(todo) {
        return $(buildItemtemplate(todo)).appendTo($todoContainer).data(todo);
    };

    /**
     *
     */
    function todoClick() {
        var todo = $(this).data();
        var $el = $(this);
        Todo.remove(todo.id).then(function (res) {
            if (res.status === 1)$el.remove();
        });
    };

    return {
        start: function () {
            Todo.getList().then(function (list) {
                addItems(list);
            });

            $todoForm.submit(function (event) {
                event.preventDefault();

                Todo.add().then(function (todo) {

                    var item = addItem(todo);
                    item.click(todoClick);
                });
            });
        }
    }
};