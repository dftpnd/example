# Задание 4; Write a simple "TODO" application frontend.

This is a one page application, it should have:
*) Form with one input and one button
*) List of TODO items
*) Each TODO item consists of title, date when it was added (in format dd.mm.yyyy), author name (link) and "Remove" link
*) Visual design of the application is not important - we’ll judge your HTML/CSS/JS skills
*) Show your knowledge of JS constructors and prototypes, write structured and maintainable code
*) Make sure the data received from client is properly sanitised and validated

Requirements:
1) Use jQuery
2) Use HTML5. Must be valid and semantically correct html
2) Use CSS3, no images. Keep it simple, this is not a design contest.
3) Should work in latest version of IE, FF and Chrome
4) Data for list of items should be loaded from data.json, through Ajax (date format is yyyy-mm-dd in json)
5) Implement list item delete by clicking it. On click send request to delete.json (must handle success and failure)
6) On form submit send POST request to save.json and add item to the list

Note:
Don’t write any backend scripts, just write front-end assuming that data.json returns data for all items,
save.json saves and returns new item and delete.json removes item.


.json files for testing:

	data.json content:
	[
		{"id": "1", "title": "Fix a car", "date": "1970-02-23", "author": "John Doe", "url": "http://www.example.com"},
		{"id": "2", "title": "Go shopping", "date": "1970-01-12", "author": "Jane Doe"}
	]

	save.json content:
	{
		"id": "3",
		"title": "Just assume this title is correct", "date": "1970-02-23", "author": "John Doe", "url": "http://www.example.com"}
	}

	delete.json content, status can be either 0 or 1:
	{
		"status": 1
	}