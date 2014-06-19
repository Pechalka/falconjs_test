var Todo = Falcon.Model.extend({
	url : 'api/todo',
	observables : {
		title : '',
		completed : false,
		change : function(){
			var c = this.completed();
			alert(c);
			//this.save();
		}
	}
})

var Todos = Falcon.Collection.extend({
	model : Todo
})


var TodoView = Falcon.View.extend({
	url : 'app/templates/todo.html',
	defaults : {
		todos :  new Todos() 
	},
	observables : {
		new_title : ''
	},
	initialize : function(){
		this.todos.fetch()
			.done(function(){ 
				console.log('load todos')
			});
	},
	add : function(){
		this.todos.create(
			new Todo({ title : this.new_title() }), {
				success : function(){
					this.new_title('')		
				}
			}, this);
		
	},
	remove : function(item){
		var accept = confirm('are you sure?');
		
		if (!accept) return;

		item.destroy({ 
			success : function(){
				this.todos.fetch()
			}
		}, this);
	}
})

var TestView = Falcon.View.extend({
	url : 'app/templates/test.html'
})

var views = {
	'todo' : TodoView,
	'test' : TestView
}

var AppView = Falcon.View.extend({
	url : 'app/templates/app.html',
	defaults : {
		views : [ 'todo', 'test']
	},
	initialize : function(){
		this.show('todo')
	},
	show : function(item){
		var View = views[item];
		Falcon.apply(new View, '#container');
	}
});

Falcon.apply(new AppView);
