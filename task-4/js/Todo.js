'use strict';

var TodoModel = function () {

    function getList() {
        return $.ajax({
            dataType: "json",
            url: "json/data.json",
        })
    }

    function add() {
        return $.ajax({
            dataType: "json",
            url: "json/save.json",
        })
    }

    function remove(id) {
        return $.ajax({
            data: {
                id: id
            },
            dataType: "json",
            url: "json/delete.json",
        })
    }

    return {
        getList: getList,
        add: add,
        remove: remove
    }
};